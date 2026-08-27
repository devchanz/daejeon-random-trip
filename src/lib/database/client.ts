import 'server-only';

import type {
  GuestbookEntryRecord,
  SharedRouteRecord,
} from './types';

/**
 * Server-only database client contract.
 * Decouples domain repository functions from specific database client SDKs.
 */
export interface DatabaseClientContract {
  insertGuestbookEntry(
    entry: Omit<GuestbookEntryRecord, 'id' | 'created_at'>
  ): Promise<GuestbookEntryRecord>;

  selectRecentGuestbookEntries(
    limit: number
  ): Promise<GuestbookEntryRecord[]>;

  insertSharedRoute(
    route: Omit<SharedRouteRecord, 'id' | 'created_at'>
  ): Promise<SharedRouteRecord>;

  selectSharedRouteByCode(
    shareCode: string
  ): Promise<SharedRouteRecord | null>;

  selectSharedRouteBySourceRouteId(
    sourceRouteId: string
  ): Promise<SharedRouteRecord | null>;
}

/**
 * Database environment configuration.
 * Server database operations require server-only SUPABASE_SECRET_KEY (or legacy SUPABASE_SERVICE_ROLE_KEY).
 */
export interface DatabaseConfig {
  supabaseUrl: string;
  supabaseSecretKey: string;
}

/**
 * Reads database configuration from process environment.
 * Validates existence of required server-only connection parameters.
 */
export function getDatabaseConfig(): DatabaseConfig {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const supabaseSecretKey =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

  return {
    supabaseUrl,
    supabaseSecretKey,
  };
}

/**
 * Helper to safely detect if a key is a legacy JWT service_role key.
 * Legacy JWTs consist of 3 dot-separated base64 segments and do not use the `sb_secret_` prefix.
 */
function isLegacyJwt(key: string): boolean {
  if (!key || key.startsWith('sb_secret_')) {
    return false;
  }
  const parts = key.split('.');
  return parts.length === 3 && parts.every((part) => part.length > 0);
}

/**
 * Standard Supabase REST API client implementation.
 * Operates over standard fetch with server-only credentials,
 * ensuring strict type safety and zero-dependency compilation.
 */
export class SupabaseRestClient implements DatabaseClientContract {
  private url: string;
  private supabaseSecretKey: string;

  constructor(config?: Partial<DatabaseConfig>) {
    const resolvedConfig = { ...getDatabaseConfig(), ...config };
    this.url = resolvedConfig.supabaseUrl.replace(/\/+$/, '');
    this.supabaseSecretKey = resolvedConfig.supabaseSecretKey;
  }

  private get headers(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      apikey: this.supabaseSecretKey,
    };

    if (isLegacyJwt(this.supabaseSecretKey)) {
      headers.Authorization = `Bearer ${this.supabaseSecretKey}`;
    }

    return headers;
  }

  private isConfigured(): boolean {
    return Boolean(this.url && this.supabaseSecretKey);
  }

  async insertGuestbookEntry(
    entry: Omit<GuestbookEntryRecord, 'id' | 'created_at'>
  ): Promise<GuestbookEntryRecord> {
    if (!this.isConfigured()) {
      throw new Error('Database is not configured. Missing server Supabase credentials (SUPABASE_URL and SUPABASE_SECRET_KEY).');
    }

    const endpoint = `${this.url}/rest/v1/guestbook_entries`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        ...this.headers,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Database insert error (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as GuestbookEntryRecord[];
    if (!data || data.length === 0) {
      throw new Error('Failed to retrieve inserted guestbook record.');
    }

    return data[0];
  }

  async selectRecentGuestbookEntries(
    limit: number
  ): Promise<GuestbookEntryRecord[]> {
    if (!this.isConfigured()) {
      throw new Error('Database is not configured. Missing server Supabase credentials (SUPABASE_URL and SUPABASE_SECRET_KEY).');
    }

    const endpoint = `${this.url}/rest/v1/guestbook_entries?status=eq.visible&order=created_at.desc&limit=${limit}`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Database select error (${response.status}): ${errorText}`);
    }

    return (await response.json()) as GuestbookEntryRecord[];
  }

  async insertSharedRoute(
    route: Omit<SharedRouteRecord, 'id' | 'created_at'>
  ): Promise<SharedRouteRecord> {
    if (!this.isConfigured()) {
      throw new Error('Database is not configured. Missing server Supabase credentials (SUPABASE_URL and SUPABASE_SECRET_KEY).');
    }

    const endpoint = `${this.url}/rest/v1/shared_routes`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        ...this.headers,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(route),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Database insert error (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as SharedRouteRecord[];
    if (!data || data.length === 0) {
      throw new Error('Failed to retrieve inserted shared route record.');
    }

    return data[0];
  }

  async selectSharedRouteByCode(
    shareCode: string
  ): Promise<SharedRouteRecord | null> {
    if (!this.isConfigured()) {
      throw new Error('Database is not configured. Missing server Supabase credentials (SUPABASE_URL and SUPABASE_SECRET_KEY).');
    }

    const sanitizedCode = encodeURIComponent(shareCode);
    const endpoint = `${this.url}/rest/v1/shared_routes?share_code=eq.${sanitizedCode}&limit=1`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Database select error (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as SharedRouteRecord[];
    return data.length > 0 ? data[0] : null;
  }

  async selectSharedRouteBySourceRouteId(
    sourceRouteId: string
  ): Promise<SharedRouteRecord | null> {
    if (!this.isConfigured()) {
      throw new Error('Database is not configured. Missing server Supabase credentials (SUPABASE_URL and SUPABASE_SECRET_KEY).');
    }

    const sanitizedId = encodeURIComponent(sourceRouteId);
    const endpoint = `${this.url}/rest/v1/shared_routes?source_route_id=eq.${sanitizedId}&limit=1`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Database select error (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as SharedRouteRecord[];
    return data.length > 0 ? data[0] : null;
  }
}

/**
 * Global server database client instance.
 */
let serverDatabaseClient: DatabaseClientContract | null = null;

/**
 * Returns the active server database client.
 * Supports client injection for testing or custom implementations.
 */
export function getDatabaseClient(): DatabaseClientContract {
  if (!serverDatabaseClient) {
    serverDatabaseClient = new SupabaseRestClient();
  }
  return serverDatabaseClient;
}

/**
 * Overrides the database client for testing or custom adapters.
 */
export function setDatabaseClient(client: DatabaseClientContract | null): void {
  serverDatabaseClient = client;
}
