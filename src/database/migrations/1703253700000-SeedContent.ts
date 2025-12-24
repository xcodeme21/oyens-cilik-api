import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedContent1703253700000 implements MigrationInterface {
  name = 'SeedContent1703253700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Seed Letters A-Z
    const letters = [
      { letter: 'A', lowercase: 'a', exampleWord: 'Apel', order: 1 },
      { letter: 'B', lowercase: 'b', exampleWord: 'Bola', order: 2 },
      { letter: 'C', lowercase: 'c', exampleWord: 'Cacing', order: 3 },
      { letter: 'D', lowercase: 'd', exampleWord: 'Domba', order: 4 },
      { letter: 'E', lowercase: 'e', exampleWord: 'Elang', order: 5 },
      { letter: 'F', lowercase: 'f', exampleWord: 'Foto', order: 6 },
      { letter: 'G', lowercase: 'g', exampleWord: 'Gajah', order: 7 },
      { letter: 'H', lowercase: 'h', exampleWord: 'Harimau', order: 8 },
      { letter: 'I', lowercase: 'i', exampleWord: 'Ikan', order: 9 },
      { letter: 'J', lowercase: 'j', exampleWord: 'Jeruk', order: 10 },
      { letter: 'K', lowercase: 'k', exampleWord: 'Kucing', order: 11 },
      { letter: 'L', lowercase: 'l', exampleWord: 'Lebah', order: 12 },
      { letter: 'M', lowercase: 'm', exampleWord: 'Mangga', order: 13 },
      { letter: 'N', lowercase: 'n', exampleWord: 'Nanas', order: 14 },
      { letter: 'O', lowercase: 'o', exampleWord: 'Orang', order: 15 },
      { letter: 'P', lowercase: 'p', exampleWord: 'Pisang', order: 16 },
      { letter: 'Q', lowercase: 'q', exampleWord: 'Quran', order: 17 },
      { letter: 'R', lowercase: 'r', exampleWord: 'Rusa', order: 18 },
      { letter: 'S', lowercase: 's', exampleWord: 'Singa', order: 19 },
      { letter: 'T', lowercase: 't', exampleWord: 'Tikus', order: 20 },
      { letter: 'U', lowercase: 'u', exampleWord: 'Ular', order: 21 },
      { letter: 'V', lowercase: 'v', exampleWord: 'Vas', order: 22 },
      { letter: 'W', lowercase: 'w', exampleWord: 'Wortel', order: 23 },
      { letter: 'X', lowercase: 'x', exampleWord: 'Xilofon', order: 24 },
      { letter: 'Y', lowercase: 'y', exampleWord: 'Yoyo', order: 25 },
      { letter: 'Z', lowercase: 'z', exampleWord: 'Zebra', order: 26 },
    ];

    for (const l of letters) {
      await queryRunner.query(`
        INSERT INTO "letters" ("letter", "lowercase", "exampleWord", "order")
        VALUES ('${l.letter}', '${l.lowercase}', '${l.exampleWord}', ${l.order})
      `);
    }

    // Seed Numbers 0-20
    const numbers = [
      { number: 0, word: 'Nol' }, { number: 1, word: 'Satu' },
      { number: 2, word: 'Dua' }, { number: 3, word: 'Tiga' },
      { number: 4, word: 'Empat' }, { number: 5, word: 'Lima' },
      { number: 6, word: 'Enam' }, { number: 7, word: 'Tujuh' },
      { number: 8, word: 'Delapan' }, { number: 9, word: 'Sembilan' },
      { number: 10, word: 'Sepuluh' }, { number: 11, word: 'Sebelas' },
      { number: 12, word: 'Dua Belas' }, { number: 13, word: 'Tiga Belas' },
      { number: 14, word: 'Empat Belas' }, { number: 15, word: 'Lima Belas' },
      { number: 16, word: 'Enam Belas' }, { number: 17, word: 'Tujuh Belas' },
      { number: 18, word: 'Delapan Belas' }, { number: 19, word: 'Sembilan Belas' },
      { number: 20, word: 'Dua Puluh' },
    ];

    for (let i = 0; i < numbers.length; i++) {
      const n = numbers[i];
      await queryRunner.query(`
        INSERT INTO "numbers" ("number", "word", "order")
        VALUES (${n.number}, '${n.word}', ${i + 1})
      `);
    }

    // Seed Animals
    const animals = [
      { name: 'Kucing', nameEn: 'Cat', description: 'Kucing adalah hewan peliharaan yang lucu dan menggemaskan.', funFact: 'Kucing bisa tidur sampai 16 jam sehari!', imageUrl: '/uploads/animals/cat.png', difficulty: 'easy' },
      { name: 'Anjing', nameEn: 'Dog', description: 'Anjing adalah sahabat terbaik manusia yang setia.', funFact: 'Anjing bisa mendengar suara 4 kali lebih jauh dari manusia!', imageUrl: '/uploads/animals/dog.png', difficulty: 'easy' },
      { name: 'Gajah', nameEn: 'Elephant', description: 'Gajah adalah hewan darat terbesar di dunia.', funFact: 'Gajah bisa mengingat teman-temannya selama bertahun-tahun!', imageUrl: '/uploads/animals/elephant.png', difficulty: 'easy' },
      { name: 'Singa', nameEn: 'Lion', description: 'Singa sering disebut sebagai raja hutan.', funFact: 'Singa jantan bisa tidur sampai 20 jam sehari!', imageUrl: '/uploads/animals/lion.png', difficulty: 'easy' },
      { name: 'Harimau', nameEn: 'Tiger', description: 'Harimau adalah kucing terbesar di dunia.', funFact: 'Setiap harimau memiliki pola belang yang unik!', imageUrl: '/uploads/animals/tiger.png', difficulty: 'medium' },
      { name: 'Jerapah', nameEn: 'Giraffe', description: 'Jerapah adalah hewan paling tinggi di dunia.', funFact: 'Lidah jerapah bisa sepanjang 50 cm!', imageUrl: '/uploads/animals/giraffe.png', difficulty: 'medium' },
      { name: 'Kuda Nil', nameEn: 'Hippopotamus', description: 'Kuda nil menghabiskan sebagian besar waktunya di air.', funFact: 'Kuda nil bisa menahan napas sampai 5 menit!', imageUrl: '/uploads/animals/hippo.png', difficulty: 'medium' },
      { name: 'Zebra', nameEn: 'Zebra', description: 'Zebra memiliki belang hitam putih yang indah.', funFact: 'Tidak ada dua zebra yang memiliki pola belang yang sama!', imageUrl: '/uploads/animals/zebra.png', difficulty: 'medium' },
      { name: 'Kelinci', nameEn: 'Rabbit', description: 'Kelinci adalah hewan berbulu lembut dengan telinga panjang.', funFact: 'Kelinci bisa melompat setinggi 1 meter!', imageUrl: '/uploads/animals/rabbit.png', difficulty: 'easy' },
      { name: 'Lumba-lumba', nameEn: 'Dolphin', description: 'Lumba-lumba adalah mamalia laut yang sangat cerdas.', funFact: 'Lumba-lumba tidur dengan satu mata terbuka!', imageUrl: '/uploads/animals/dolphin.png', difficulty: 'medium' },
      { name: 'Penguin', nameEn: 'Penguin', description: 'Penguin adalah burung yang tidak bisa terbang tapi pandai berenang.', funFact: 'Penguin bisa minum air laut!', imageUrl: '/uploads/animals/penguin.png', difficulty: 'medium' },
      { name: 'Burung Hantu', nameEn: 'Owl', description: 'Burung hantu aktif di malam hari dan memiliki mata besar.', funFact: 'Burung hantu bisa memutar kepalanya hampir 270 derajat!', imageUrl: '/uploads/animals/owl.png', difficulty: 'hard' },
      { name: 'Buaya', nameEn: 'Crocodile', description: 'Buaya adalah reptil besar yang hidup di sungai.', funFact: 'Buaya sudah ada sejak zaman dinosaurus!', imageUrl: '/uploads/animals/crocodile.png', difficulty: 'hard' },
      { name: 'Kura-kura', nameEn: 'Turtle', description: 'Kura-kura membawa rumahnya di punggungnya.', funFact: 'Beberapa kura-kura bisa hidup lebih dari 100 tahun!', imageUrl: '/uploads/animals/turtle.png', difficulty: 'easy' },
      { name: 'Monyet', nameEn: 'Monkey', description: 'Monyet adalah hewan yang sangat lincah dan cerdas.', funFact: 'Monyet bisa mengenali wajahnya di cermin!', imageUrl: '/uploads/animals/monkey.png', difficulty: 'easy' },
    ];

    for (let i = 0; i < animals.length; i++) {
      const a = animals[i];
      await queryRunner.query(`
        INSERT INTO "animals" ("name", "nameEn", "description", "funFact", "imageUrl", "difficulty", "order")
        VALUES ('${a.name}', '${a.nameEn}', '${a.description}', '${a.funFact}', '${a.imageUrl}', '${a.difficulty}', ${i + 1})
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "animals"`);
    await queryRunner.query(`DELETE FROM "numbers"`);
    await queryRunner.query(`DELETE FROM "letters"`);
  }
}
