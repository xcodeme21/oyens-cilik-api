import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Letter } from './entities/letter.entity';
import { NumberEntity } from './entities/number.entity';
import { Animal } from './entities/animal.entity';

@Injectable()
export class ContentService implements OnModuleInit {
  constructor(
    @InjectRepository(Letter)
    private readonly letterRepository: Repository<Letter>,
    @InjectRepository(NumberEntity)
    private readonly numberRepository: Repository<NumberEntity>,
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
  ) {}

  async onModuleInit() {
    // Seed initial data if empty
    await this.seedLetters();
    await this.seedNumbers();
    await this.seedAnimals();
  }

  // ==================== LETTERS ====================

  async getAllLetters(): Promise<Letter[]> {
    return this.letterRepository.find({ order: { order: 'ASC' } });
  }

  async getLetterById(id: number): Promise<Letter | null> {
    return this.letterRepository.findOne({ where: { id } });
  }

  async getLetterByChar(letter: string): Promise<Letter | null> {
    return this.letterRepository.findOne({
      where: { letter: letter.toUpperCase() },
    });
  }

  // ==================== NUMBERS ====================

  async getAllNumbers(): Promise<NumberEntity[]> {
    return this.numberRepository.find({ order: { order: 'ASC' } });
  }

  async getNumberById(id: number): Promise<NumberEntity | null> {
    return this.numberRepository.findOne({ where: { id } });
  }

  async getNumberByValue(value: number): Promise<NumberEntity | null> {
    return this.numberRepository.findOne({ where: { number: value } });
  }

  // ==================== ANIMALS ====================

  async getAllAnimals(): Promise<Animal[]> {
    return this.animalRepository.find({ order: { order: 'ASC' } });
  }

  async getAnimalById(id: number): Promise<Animal | null> {
    return this.animalRepository.findOne({ where: { id } });
  }

  async getAnimalsByDifficulty(difficulty: string): Promise<Animal[]> {
    return this.animalRepository.find({
      where: { difficulty },
      order: { order: 'ASC' },
    });
  }

  async getRandomAnimalQuiz(count: number = 5): Promise<Animal[]> {
    const animals = await this.animalRepository
      .createQueryBuilder('animal')
      .orderBy('RANDOM()')
      .limit(count)
      .getMany();
    return animals;
  }

  // ==================== SEED DATA ====================

  private async seedLetters() {
    const count = await this.letterRepository.count();
    if (count > 0) return;

    await this.performSeedLetters();
  }

  async reseedLetters() {
    await this.letterRepository.clear();
    await this.performSeedLetters();
    return { message: 'Letters reseeded successfully' };
  }

  private async performSeedLetters() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const exampleWords: Record<string, string> = {
      A: 'Apel', B: 'Bola', C: 'Cacing', D: 'Domba', E: 'Elang',
      F: 'Foto', G: 'Gajah', H: 'Harimau', I: 'Ikan', J: 'Jeruk',
      K: 'Kucing', L: 'Lebah', M: 'Mangga', N: 'Nanas', O: 'Orang',
      P: 'Pisang', Q: 'Quran', R: 'Rusa', S: 'Singa', T: 'Tikus',
      U: 'Ular', V: 'Vas', W: 'Wortel', X: 'Xilofon', Y: 'Yoyo',
      Z: 'Zebra',
    };

    const letterEntities = letters.map((l, i) => ({
      letter: l,
      lowercase: l.toLowerCase(),
      exampleWord: exampleWords[l],
      order: i + 1,
    }));

    await this.letterRepository.save(letterEntities);
    console.log('🔤 Seeded letters A-Z');
  }

  private async seedNumbers() {
    const count = await this.numberRepository.count();
    if (count > 0) return;

    const numberWords = [
      'Nol', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima',
      'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh',
      'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 'Lima Belas',
      'Enam Belas', 'Tujuh Belas', 'Delapan Belas', 'Sembilan Belas', 'Dua Puluh',
    ];

    const numberEntities = numberWords.map((word, i) => ({
      number: i,
      numberWord: word,
      order: i,
    }));

    await this.numberRepository.save(numberEntities);
    console.log('🔢 Seeded numbers 0-20');
  }

  private async seedAnimals() {
    const count = await this.animalRepository.count();
    if (count > 0) return;

    const animals = [
      {
        name: 'Kucing',
        nameEnglish: 'Cat',
        description: 'Kucing adalah hewan peliharaan yang lucu dan menggemaskan.',
        funFact: 'Kucing bisa tidur sampai 16 jam sehari!',
        habitat: 'Rumah',
        difficulty: 'easy',
        order: 1,
      },
      {
        name: 'Anjing',
        nameEnglish: 'Dog',
        description: 'Anjing adalah sahabat terbaik manusia yang setia.',
        funFact: 'Anjing bisa mendengar suara 4 kali lebih jauh dari manusia!',
        habitat: 'Rumah',
        difficulty: 'easy',
        order: 2,
      },
      {
        name: 'Gajah',
        nameEnglish: 'Elephant',
        description: 'Gajah adalah hewan darat terbesar di dunia.',
        funFact: 'Gajah bisa mengingat teman-temannya selama bertahun-tahun!',
        habitat: 'Hutan Afrika dan Asia',
        difficulty: 'easy',
        order: 3,
      },
      {
        name: 'Singa',
        nameEnglish: 'Lion',
        description: 'Singa sering disebut sebagai raja hutan.',
        funFact: 'Singa jantan bisa tidur sampai 20 jam sehari!',
        habitat: 'Sabana Afrika',
        difficulty: 'easy',
        order: 4,
      },
      {
        name: 'Harimau',
        nameEnglish: 'Tiger',
        description: 'Harimau adalah kucing terbesar di dunia.',
        funFact: 'Setiap harimau memiliki pola belang yang unik seperti sidik jari!',
        habitat: 'Hutan Asia',
        difficulty: 'medium',
        order: 5,
      },
      {
        name: 'Jerapah',
        nameEnglish: 'Giraffe',
        description: 'Jerapah adalah hewan paling tinggi di dunia.',
        funFact: 'Lidah jerapah bisa sepanjang 50 cm!',
        habitat: 'Sabana Afrika',
        difficulty: 'medium',
        order: 6,
      },
      {
        name: 'Kuda Nil',
        nameEnglish: 'Hippopotamus',
        description: 'Kuda nil menghabiskan sebagian besar waktunya di air.',
        funFact: 'Kuda nil bisa menahan napas sampai 5 menit!',
        habitat: 'Sungai Afrika',
        difficulty: 'medium',
        order: 7,
      },
      {
        name: 'Zebra',
        nameEnglish: 'Zebra',
        description: 'Zebra memiliki belang hitam putih yang indah.',
        funFact: 'Tidak ada dua zebra yang memiliki pola belang yang sama!',
        habitat: 'Padang rumput Afrika',
        difficulty: 'easy',
        order: 8,
      },
      {
        name: 'Kelinci',
        nameEnglish: 'Rabbit',
        description: 'Kelinci adalah hewan berbulu lembut dengan telinga panjang.',
        funFact: 'Kelinci bisa melompat setinggi 1 meter!',
        habitat: 'Padang rumput',
        difficulty: 'easy',
        order: 9,
      },
      {
        name: 'Lumba-lumba',
        nameEnglish: 'Dolphin',
        description: 'Lumba-lumba adalah mamalia laut yang sangat cerdas.',
        funFact: 'Lumba-lumba tidur dengan satu mata terbuka!',
        habitat: 'Laut',
        difficulty: 'medium',
        order: 10,
      },
      {
        name: 'Penguin',
        nameEnglish: 'Penguin',
        description: 'Penguin adalah burung yang tidak bisa terbang tapi pandai berenang.',
        funFact: 'Penguin bisa minum air laut!',
        habitat: 'Antartika',
        difficulty: 'medium',
        order: 11,
      },
      {
        name: 'Burung Hantu',
        nameEnglish: 'Owl',
        description: 'Burung hantu aktif di malam hari dan memiliki mata besar.',
        funFact: 'Burung hantu bisa memutar kepalanya hampir 360 derajat!',
        habitat: 'Hutan',
        difficulty: 'hard',
        order: 12,
      },
      {
        name: 'Buaya',
        nameEnglish: 'Crocodile',
        description: 'Buaya adalah reptil besar yang hidup di sungai.',
        funFact: 'Buaya sudah ada sejak zaman dinosaurus!',
        habitat: 'Sungai tropis',
        difficulty: 'hard',
        order: 13,
      },
      {
        name: 'Kura-kura',
        nameEnglish: 'Turtle',
        description: 'Kura-kura membawa rumahnya di punggungnya.',
        funFact: 'Beberapa kura-kura bisa hidup lebih dari 100 tahun!',
        habitat: 'Darat dan laut',
        difficulty: 'easy',
        order: 14,
      },
      {
        name: 'Monyet',
        nameEnglish: 'Monkey',
        description: 'Monyet adalah hewan yang sangat lincah dan cerdas.',
        funFact: 'Monyet bisa mengenali wajahnya di cermin!',
        habitat: 'Hutan tropis',
        difficulty: 'easy',
        order: 15,
      },
    ];

    await this.animalRepository.save(animals);
    console.log('🦁 Seeded 15 animals');
  }
}
