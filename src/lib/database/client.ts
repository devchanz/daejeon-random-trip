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
 * Server database operations require server-only SUPABASE_SERVICE_ROLE_KEY.
 */
export interface DatabaseConfig {
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
}

/**
 * Reads database configuration from process environment.
 * Validates existence of required server-only connection parameters.
 */
export function getDatabaseConfig(): DatabaseConfig {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

  return {
    supabaseUrl,
    supabaseServiceRoleKey,
  };
}

/**
 * Standard Supabase REST API client implementation.
 * Operates over standard fetch with server-only credentials,
 * ensuring strict type safety and zero-dependency compilation.
 */
export class SupabaseRestClient implements DatabaseClientContract {
  private url: string;
  private serviceRoleKey: string;

  constructor(config?: Partial<DatabaseConfig>) {
    const resolvedConfig = { ...getDatabaseConfig(), ...config };
    this.url = resolvedConfig.supabaseUrl.replace(/\/+$/, '');
    this.serviceRoleKey = resolvedConfig.supabaseServiceRoleKey;
  }

  private get headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      apikey: this.serviceRoleKey,
      Authorization: `Bearer ${this.serviceRoleKey}`,
    };
  }

  private isConfigured(): boolean {
    return Boolean(this.url && this.serviceRoleKey);
  }

  async insertGuestbookEntry(
    entry: Omit<GuestbookEntryRecord, 'id' | 'created_at'>
  ): Promise<GuestbookEntryRecord> {
    if (!this.isConfigured()) {
      throw new Error('Database is not configured. Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY.');
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
      throw new Error('Database is not configured. Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY.');
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
      throw new Error('Database is not configured. Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY.');
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
      throw new Error('Database is not configured. Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY.');
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
      throw new Error('Database is not configured. Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY.');
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
