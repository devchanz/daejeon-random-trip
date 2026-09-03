import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ZONE_MAP = {
    '소제동': 'soje',
    '만년동': 'mannyeon',
    '갈마동': 'galma',
    '선화동': 'seonhwa',
    '도룡동': 'doryong',
    '대흥동': 'daeheung',
    '어은동·궁동': 'eoeun-gung',
    '반석동': 'banseok',
    '봉명동': 'bongmyeong',
    '관저동': 'gwanjeo',
    '은행동': 'eunhaeng',
    '대사동': 'daesa',
    '죽동': 'jukdong',
    '송촌동': 'songchon',
    '탄방동': 'tanbang',
    '대동': 'daedong',
    '대사동 인접(대흥동)': 'daeheung',
    '대사동 인접(부사동)': 'daesa'
};

const PHOTO_KEYWORDS = [
    '정원', '한옥', '고택', '전망', '루프탑', '테라스', '통창', '풍경', '야경',
    '골목', '건축', '전시', '미술', '공원', '수목원', '수변', '하천', '이국적', '감성'
];

const VALID_CATEGORIES = new Set([
    '식사',
    '카페·디저트',
    '볼거리·문화·체험',
    '산책·야간'
]);

function getDuration(category) {
    if (category === '식사') return 75;
    if (category === '카페·디저트') return 60;
    if (category === '볼거리·문화·체험') return 60;
    if (category === '산책·야간') return 45;
    throw new Error(`Unknown category: ${category}`);
}

function generateTags(category, introDisplay) {
    const tags = [];
    if (category === '식사' || category === '카페·디저트') {
        tags.push('food');
    }
    if (category === '산책·야간') {
        tags.push('walk');
    }
    
    let isPhoto = false;
    if (category === '볼거리·문화·체험' || category === '산책·야간') {
        isPhoto = true;
    } else if (category === '카페·디저트') {
        if (introDisplay) {
            isPhoto = PHOTO_KEYWORDS.some(kw => introDisplay.includes(kw));
        }
    }
    
    if (isPhoto) {
        tags.push('photo');
    }
    return tags;
}

function run() {
    const dataPath = path.join(__dirname, '../data/research/daejeon_place_patch_258.json');
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(raw);
    const records = data.records;

    if (records.length !== 258) {
        throw new Error(`Validation failed: Output count is not 258. Found ${records.length}`);
    }

    const seenIds = new Set();
    const generated = [];

    const stats = {
        total: 0,
        active: 0,
        inactive: 0,
        byZone: {},
        byCategory: {},
        foodTags: 0,
        walkTags: 0,
        photoTags: 0,
        reviewRecords: []
    };

    records.forEach(r => {
        // ID deduplication
        if (seenIds.has(r.placeIdCandidate)) {
            throw new Error(`Validation failed: Duplicate ID found ${r.placeIdCandidate}`);
        }
        seenIds.add(r.placeIdCandidate);

        // Zone resolution
        const zoneId = ZONE_MAP[r.zoneName];
        if (!zoneId) {
            throw new Error(`Validation failed: Canonical zone cannot resolve for ${r.zoneName}`);
        }

        // Category validation
        if (!VALID_CATEGORIES.has(r.category)) {
            throw new Error(`Validation failed: Unknown normalized category ${r.category}`);
        }

        // Active policy
        let active = false;
        if (r.qa && (r.qa.status === 'PASS' || r.qa.status === 'INFO')) {
            active = true;
        } else if (r.qa && r.qa.status === 'REVIEW') {
            active = false;
            stats.reviewRecords.push(r.name);
        }

        // Description
        const descParts = [];
        if (r.operation) {
            if (r.operation.hoursDisplay) descParts.push(r.operation.hoursDisplay);
            if (r.operation.breakDisplay) descParts.push(r.operation.breakDisplay);
            if (r.operation.closedDisplay) descParts.push(r.operation.closedDisplay);
        }
        const description = descParts.length > 0 ? descParts.join(' / ') : undefined;

        const durationMin = getDuration(r.category);
        const tags = generateTags(r.category, r.introDisplay);

        const place = {
            id: r.placeIdCandidate,
            name: r.name,
            category: r.category,
            zoneId: zoneId,
            durationMin: durationMin,
            tags: tags,
            mapLinks: {
                naver: r.mapUrl
            },
            mapUrl: r.mapUrl,
            active: active
        };

        if (r.introDisplay) place.hook = r.introDisplay;
        if (description) place.description = description;

        // Ensure required fields
        if (!place.id || !place.name || !place.category || !place.zoneId || !place.durationMin || !place.tags || place.active === undefined) {
            throw new Error(`Validation failed: Required fields missing in ${place.id}`);
        }

        generated.push(place);

        // Stats
        stats.total++;
        if (active) stats.active++; else stats.inactive++;
        stats.byZone[zoneId] = (stats.byZone[zoneId] || 0) + 1;
        stats.byCategory[r.category] = (stats.byCategory[r.category] || 0) + 1;
        if (tags.includes('food')) stats.foodTags++;
        if (tags.includes('walk')) stats.walkTags++;
        if (tags.includes('photo')) stats.photoTags++;
    });

    // Write to places.ts
    const outPath = path.join(__dirname, '../src/data/places.ts');
    let content = `import type { PlaceCandidate } from '../lib/random/types';\n\n`;
    content += `/**\n * Normalized Daejeon Place Candidates Dataset (Generated).\n`;
    content += ` * Generated from data/research/daejeon_place_patch_258.json\n */\n`;
    content += `export const PLACE_CANDIDATES: readonly PlaceCandidate[] = [\n`;
    generated.forEach((p, idx) => {
        content += `  ${JSON.stringify(p, null, 2).split('\\n').join('\\n  ')}`;
        if (idx < generated.length - 1) content += ',';
        content += '\n';
    });
    content += `];\n`;

    fs.writeFileSync(outPath, content, 'utf-8');

    console.log("=== GENERATION REPORT ===");
    console.log("Total generated records:", stats.total);
    console.log("Active records:", stats.active);
    console.log("Inactive records:", stats.inactive);
    console.log("\\nCount by canonical zone:");
    for (const [z, count] of Object.entries(stats.byZone)) {
        console.log(`  ${z}: ${count}`);
    }
    console.log("\\nCount by normalized category:");
    for (const [c, count] of Object.entries(stats.byCategory)) {
        console.log(`  ${c}: ${count}`);
    }
    console.log("\\nTag counts:");
    console.log("  food:", stats.foodTags);
    console.log("  walk:", stats.walkTags);
    console.log("  photo:", stats.photoTags);
    console.log("\\nREVIEW (inactive) records:", stats.reviewRecords);
    console.log("Validation: PASS");
}

try {
    run();
} catch (e) {
    console.error(e.message);
    process.exit(1);
}
