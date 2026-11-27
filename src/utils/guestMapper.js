export function mapDbRsvpToUi(status) {
  if (status === "attending" || status === "accepted") return "Tham dự";
  if (status === "declined") return "Từ chối";
  return "Chờ phản hồi";
}

export function mapUiRsvpToDb(rsvp) {
  if (rsvp === "Tham dự") return "accepted";
  if (rsvp === "Từ chối") return "declined";
  return "pending";
}

export function splitFullName(fullName = "") {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return { lastName: "", firstName: parts[0] || "" };
  }
  return {
    lastName: parts.slice(0, -1).join(" "),
    firstName: parts[parts.length - 1],
  };
}

export function mapDbGuestsToUi(dbGuests = [], guestMetaById = {}) {
  return dbGuests.map((row) => {
    const meta = guestMetaById[row.id] || {};
    const { lastName, firstName } = splitFullName(row.full_name);
    return {
      id: row.id,
      fullName: row.full_name,
      lastName: meta.lastName ?? lastName,
      firstName: meta.firstName ?? firstName,
      side: meta.side || (row.group?.side === "bride" ? "Nhà gái" : "Nhà trai"),
      phone: row.phone || "",
      email: row.email || "",
      address: meta.address || "",
      rsvp: mapDbRsvpToUi(row.rsvp_status),
      companions: Number(row.max_companions) || 0,
      tag: meta.tag || row.group?.name || "Bạn bè",
      tableId: meta.tableId || "",
      tableName: meta.tableName || "Chưa xếp bàn",
      inviteToken: row.invite_token || "",
    };
  });
}

