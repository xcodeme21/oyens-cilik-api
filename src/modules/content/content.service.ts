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

  async getLetterByOrder(order: number): Promise<Letter | null> {
    return this.letterRepository.findOne({ where: { order } });
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

  async getNumberByOrder(order: number): Promise<NumberEntity | null> {
    return this.numberRepository.findOne({ where: { order } });
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

  async getAnimalByOrder(order: number): Promise<Animal | null> {
    return this.animalRepository.findOne({ where: { order } });
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

  async reseedAnimals() {
    await this.animalRepository.clear();
    await this.seedAnimals();
    return { message: 'Animals reseeded successfully' };
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
        nameEn: 'Cat',
        description: 'Kucing adalah hewan peliharaan yang lucu dan menggemaskan.',
        funFact: 'Kucing bisa tidur sampai 16 jam sehari!',
        imageUrl: 'https://oyens-cilik-api.vercel.app/api/content/animals/image/cat.png',
        audioUrl: undefined,
        order: 1,
      },
      {
        name: 'Anjing',
        nameEn: 'Dog',
        description: 'Anjing adalah sahabat terbaik manusia yang setia.',
        funFact: 'Anjing bisa mendengar suara 4 kali lebih jauh dari manusia!',
        imageUrl: 'https://oyens-cilik-api.vercel.app/api/content/animals/image/dog.png',
        audioUrl: undefined,
        order: 2,
      },
      {
        name: 'Gajah',
        nameEn: 'Elephant',
        description: 'Gajah adalah hewan darat terbesar di dunia.',
        funFact: 'Gajah bisa mengingat teman-temannya selama bertahun-tahun!',
        imageUrl: 'https://oyens-cilik-api.vercel.app/api/content/animals/image/elephant.png',
        audioUrl: undefined,
        order: 3,
      },
      {
        name: 'Singa',
        nameEn: 'Lion',
        description: 'Singa sering disebut sebagai raja hutan.',
        funFact: 'Singa jantan bisa tidur sampai 20 jam sehari!',
        imageUrl: 'https://oyens-cilik-api.vercel.app/api/content/animals/image/lion.png',
        audioUrl: undefined,
        order: 4,
      },
      {
        name: 'Harimau',
        nameEn: 'Tiger',
        description: 'Harimau adalah kucing terbesar di dunia.',
        funFact: 'Setiap harimau memiliki pola belang yang unik seperti sidik jari!',
        imageUrl: 'https://oyens-cilik-api.vercel.app/api/content/animals/image/tiger.png',
        audioUrl: undefined,
        order: 5,
      },
      {
        name: 'Jerapah',
        nameEn: 'Giraffe',
        description: 'Jerapah adalah hewan paling tinggi di dunia.',
        funFact: 'Lidah jerapah bisa sepanjang 50 cm!',
        imageUrl: 'https://oyens-cilik-api.vercel.app/api/content/animals/image/giraffe.png',
        audioUrl: undefined,
        order: 6,
      },
      {
        name: 'Kuda Nil',
        nameEn: 'Hippopotamus',
        description: 'Kuda nil menghabiskan sebagian besar waktunya di air.',
        funFact: 'Kuda nil bisa menahan napas sampai 5 menit!',
        imageUrl: 'https://oyens-cilik-api.vercel.app/api/content/animals/image/hippo.png',
        audioUrl: undefined,
        order: 7,
      },
      {
        name: 'Zebra',
        nameEn: 'Zebra',
        description: 'Zebra memiliki belang hitam putih yang indah.',
        funFact: 'Tidak ada dua zebra yang memiliki pola belang yang sama!',
        imageUrl: 'https://oyens-cilik-api.vercel.app/api/content/animals/image/zebra.png',
        audioUrl: undefined,
        order: 8,
      },
      {
        name: 'Kelinci',
        nameEn: 'Rabbit',
        description: 'Kelinci adalah hewan berbulu lembut dengan telinga panjang.',
        funFact: 'Kelinci bisa melompat setinggi 1 meter!',
        imageUrl: 'https://oyens-cilik-api.vercel.app/api/content/animals/image/rabbit.png',
        audioUrl: undefined,
        order: 9,
      },
      {
        name: 'Lumba-lumba',
        nameEn: 'Dolphin',
        description: 'Lumba-lumba adalah mamalia laut yang sangat cerdas.',
        funFact: 'Lumba-lumba tidur dengan satu mata terbuka!',
        imageUrl: 'https://oyens-cilik-api.vercel.app/api/content/animals/image/dolphin.png',
        audioUrl: undefined,
        order: 10,
      },
      {
        name: 'Penguin',
        nameEn: 'Penguin',
        description: 'Penguin adalah burung yang tidak bisa terbang tapi pandai berenang.',
        funFact: 'Penguin bisa minum air laut!',
        imageUrl: 'https://oyens-cilik-api.vercel.app/api/content/animals/image/penguin.png',
        audioUrl: undefined,
        order: 11,
      },
      {
        name: 'Burung Hantu',
        nameEn: 'Owl',
        description: 'Burung hantu aktif di malam hari dan memiliki mata besar.',
        funFact: 'Burung hantu bisa memutar kepalanya hampir 360 derajat!',
        imageUrl: 'https://oyens-cilik-api.vercel.app/api/content/animals/image/owl.png',
        audioUrl: undefined,
        order: 12,
      },
      {
        name: 'Buaya',
        nameEn: 'Crocodile',
        description: 'Buaya adalah reptil besar yang hidup di sungai.',
        funFact: 'Buaya sudah ada sejak zaman dinosaurus!',
        imageUrl: 'https://oyens-cilik-api.vercel.app/api/content/animals/image/crocodile.png',
        audioUrl: undefined,
        order: 13,
      },
      {
        name: 'Kura-kura',
        nameEn: 'Turtle',
        description: 'Kura-kura membawa rumahnya di punggungnya.',
        funFact: 'Beberapa kura-kura bisa hidup lebih dari 100 tahun!',
        imageUrl: 'https://oyens-cilik-api.vercel.app/api/content/animals/image/turtle.png',
        audioUrl: undefined,
        order: 14,
      },
      {
        name: 'Monyet',
        nameEn: 'Monkey',
        description: 'Monyet adalah hewan yang sangat lincah dan cerdas.',
        funFact: 'Monyet bisa mengenali wajahnya di cermin!',
        imageUrl: 'https://oyens-cilik-api.vercel.app/api/content/animals/image/monkey.png',
        audioUrl: undefined,
        order: 15,
      },
    ];

    await this.animalRepository.save(animals);
    console.log('🦁 Seeded 15 animals');
  }
}
