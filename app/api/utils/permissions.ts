import client from "./db";

// Define permission types
type Status = "Pending" | "Inactive" | "Active" | "Locked";
type PaymentStatus = "Maintained" | "Exceeded" | "Initial";

interface Permissions {
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
  canAdd: boolean;
}

// Permissions map based on status and payment_status
const permissionsMap: Record<Status, Record<PaymentStatus, Permissions>> = {
  Pending: {
    Maintained: { canEdit: false, canDelete: false, canView: true, canAdd: false },
    Exceeded: { canEdit: false, canDelete: false, canView: true, canAdd: false },
    Initial: { canEdit: false, canDelete: false, canView: true, canAdd: false },
  },
 Locked: {
    Maintained: { canEdit: false, canDelete: false, canView: true, canAdd: false },
    Exceeded: { canEdit: false, canDelete: false, canView: true, canAdd: false },
    Initial: { canEdit: false, canDelete: false, canView: true, canAdd: false },
  },
  Inactive: {
    Maintained: { canEdit: false, canDelete: false, canView: true, canAdd: false },
    Exceeded: { canEdit: false, canDelete: false, canView: true, canAdd: false },
    Initial: { canEdit: false, canDelete: false, canView: true, canAdd: false },
  },
  Active: {
    Maintained: { canEdit: true, canDelete: false, canView: true, canAdd: true },
    Exceeded: { canEdit: false, canDelete: false, canView: true, canAdd: false },
    Initial: { canEdit: false, canDelete: false, canView: true, canAdd: false },
  },
};

// Function to fetch institution permissions
export const getInstitutionPermissions = async (institutionId: string): Promise<Permissions | null> => {
  console.log("recieved: "+institutionId);
  try {
    const query = "SELECT status, payment_status FROM institutions WHERE id = $1";
    const result = await client.query(query, [institutionId]);
    
    if (result.rows.length === 0) return null;

    const { status, payment_status } = result.rows[0] as { status: Status; payment_status: PaymentStatus };

    return permissionsMap[status][payment_status];
  } catch (error) {
    console.error("Error fetching institution permissions:", error);
    return null;
  }
};
