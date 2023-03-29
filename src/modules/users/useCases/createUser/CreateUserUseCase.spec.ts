import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create user", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      name: "Renan",
      email: "renan@mail.com",
      password: "123",
    };

    await createUserUseCase.execute(user);

    const userCreated = await usersRepositoryInMemory.findByEmail(user.email);

    expect(userCreated).toHaveProperty("id");
    expect(userCreated).toHaveProperty("password");
    expect(userCreated).toHaveProperty("name", user.name);
    expect(userCreated).toHaveProperty("email", user.email);
  });

  it("Should not be able to create a new user with email exists", async () => {
    const user: ICreateUserDTO = {
      name: "João",
      email: "joao@mail.com",
      password: "123",
    };

    await createUserUseCase.execute(user);

    await expect(createUserUseCase.execute(user))
      .rejects.toBeInstanceOf(CreateUserError);
  });
});
