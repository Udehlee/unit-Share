function transaction({id,sender_id,recipient_id,units_Transferred,_status}){
    return {
        id,
        senderId: sender_id,
        recipientId: recipient_id,
        unitsTransferred: units_Transferred,
        status: _status,
        createdAt: new Date(),
    }
}

export default { transaction }