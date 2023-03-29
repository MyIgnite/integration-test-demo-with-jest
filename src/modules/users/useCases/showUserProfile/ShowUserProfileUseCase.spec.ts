import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  it("Should be able to return an user profile", async () => {
    const user: ICreateUserDTO = {
      name: "renan",
      email: "renan@email.com",
      password: "123"
    };

    const userCreated = await createUserUseCase.execute(user);
    const idUser = <string>userCreated.id

    const userResultProfile = await showUserProfileUseCase.execute(idUser);

    expect(userResultProfile).toHaveProperty("id");
    expect(userResultProfile).toHaveProperty("email");
    expect(userResultProfile).toHaveProperty("name");
    expect(userResultProfile).toHaveProperty("password");
  });

  it("Should not be able to return an user profile nonexistent", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("inexistent id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
})