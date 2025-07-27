function user( {id, fullname, email, pass_word, meter_number, meter_type, unit_balance, created_at }) {
  return {
    id,
    fullname,
    email,
    password: pass_word,
    meterNumber: meter_number,
    meterType: meter_type,
    unitBalance: unit_balance,
    createdAt: created_at,
  };
}

export default user;
