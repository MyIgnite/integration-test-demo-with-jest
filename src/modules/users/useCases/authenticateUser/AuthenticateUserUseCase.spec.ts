import authConfig from "../../../../config/auth";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate user", () => {
  beforeEach(() => {
    authConfig.jwt.secret = "21232f297a57a5a743894a0e4a801fc3";
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to authenticate a user", async () => {
    const user: ICreateUserDTO = {
      name: "Renan",
      email: "renan@email.com",
      password: "123",
    };

    await createUserUseCase.execute(user);

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: "123"
    });

    expect(authenticatedUser.user).toHaveProperty("id");
    expect(authenticatedUser.user).toHaveProperty("email", user.email);
    expect(authenticatedUser.user).toHaveProperty("name", user.name);
    expect(authenticatedUser).toHaveProperty("token");
  });

  it("Should be able to authenticate a user", async () => {
    const user: ICreateUserDTO = {
      name: "Renan",
      email: "renan@email.com",
      password: "123",
    };

    await createUserUseCase.execute(user);

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: "123"
    });

    expect(authenticatedUser.user).toHaveProperty("id");
    expect(authenticatedUser.user).toHaveProperty("email", user.email);
    expect(authenticatedUser.user).toHaveProperty("name", user.name);
    expect(authenticatedUser).toHaveProperty("token");
  });

  it("Should not be able to authenticate an unexistent user", async () => {
    await expect( authenticateUserUseCase.execute({
        email: "renan@email.com",
        password: "123"
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be able to authenticate an user with incorrect password", async () => {
    const user: ICreateUserDTO = {
      name: "Renan",
      email: "renan@mail.com",
      password: "123",
    };

    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrect password",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});