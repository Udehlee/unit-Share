function transaction({ id, sender_id, recipient_id, units_transferred, _status, created_at }) {
  return {
    id,
    senderId: sender_id,
    recipientId: recipient_id,
    unitsTransferred: units_transferred,
    status: _status,
    createdAt: created_at, 
  };
}

export default transaction;