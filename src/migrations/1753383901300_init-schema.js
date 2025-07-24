export const up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    fullname: {
         type: 'varchar(255)',
          notNull: true 
        },
    email: {
         type: 'varchar(255)',
         notNull: true,
         unique: true 
        },
    pass_word: {
         type: 'varchar(255)',
         notNull: true 
        },
    meter_number: {
         type: 'varchar(255)',
         notNull: true 
        },
    meter_type: {
         type: 'varchar(255)',
         notNull: true 
        },
    unit_balance: { 
        type: 'integer', 
        notNull: true, 
        default: 0 
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createTable('transactions', {
    id: 'id',
    sender_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    recipient_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    units_transferred: { 
      type: 'integer',
       notNull: true 
      },
    _status: { 
      type: 'varchar(50)', 
      notNull: true 
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('transactions', 'recipient_id');
  pgm.createIndex('transactions', 'sender_id');
};

export const down = (pgm) => {
  pgm.dropTable('transactions');
  pgm.dropTable('users');
};