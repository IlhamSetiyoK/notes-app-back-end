/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    // Create new user
    pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES ('old_notes', 'old_notes', 'old_notes', 'old notes')");

    // Change old note owner to new user
    pgm.sql("UPDATE notes SET owner = 'old_notes' WHERE owner = NULL");

    // Add constraint foreign key to owner
    pgm.addConstraint('notes', 'fk_notes.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    // Drop constraint
  pgm.dropConstraint('notes', 'fk_notes.owner_users.id');

  // Set Owner to null
  pgm.sql("UPDATE notes SET owner = NULL WHERE owner = 'old_notes'");

  // Delete new user
  pgm.sql("DELETE FROM users WHERE id = 'old_notes'");
};
