import faker from '@faker-js/faker';
import { signInSchema } from '@/schemas';

describe('signInSchema', () => {
  const generateValidInput = (passwordLenght = 10) => ({
    email: faker.internet.email(),
    password: faker.internet.password(passwordLenght),
  });

  describe('when email is not valid', () => {
    it('should return error if email is not present', () => {
      const input = generateValidInput();
      delete input.email;

      const { error } = signInSchema.validate(input);

      expect(error).toBeDefined();
    });

    it('should return error if email does not follow valid email format', () => {
      const input = generateValidInput();
      input.email = faker.lorem.word();

      const { error } = signInSchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  describe('when password is not valid', () => {
    it('should return error if password has less then 10 characters', () => {
      const input = generateValidInput(6);
      delete input.password;

      const { error } = signInSchema.validate(input);

      expect(error).toBeDefined();
    });

    it('should return error if password is not present', () => {
      const input = generateValidInput();
      delete input.password;

      const { error } = signInSchema.validate(input);

      expect(error).toBeDefined();
    });

    it('should return error if password is not a string', () => {
      const input = generateValidInput();

      const { error } = signInSchema.validate({ ...input, password: faker.datatype.number() });

      expect(error).toBeDefined();
    });
  });

  it('should return no error if input is valid', () => {
    const input = generateValidInput();

    const { error } = signInSchema.validate(input);

    expect(error).toBeUndefined();
  });
});
