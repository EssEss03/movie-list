/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('movies').del()

  //Inserts seed entries
  await knex('movies').insert([
    { title: 'Grown Ups', watched: false },
    { title: 'Bad Boys', watched: true },
    { title: 'Devil Wears Prada', watched: false },
    { title: 'The Harder They Fall', watched: true },
    { title: 'Underworld', watched: true },
  ]);
};
