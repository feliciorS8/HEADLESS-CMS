export type TaskStatus = "todo" | "in_progress" | "done";

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          budget: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          budget?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          budget?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          status: TaskStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          status?: TaskStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          description?: string | null;
          status?: TaskStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type PublicSchema = DatabaseWithoutInternals["public"];

export type Tables<TableName extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][TableName]["Row"];

export type TablesInsert<TableName extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][TableName]["Insert"];

export type TablesUpdate<TableName extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][TableName]["Update"];
