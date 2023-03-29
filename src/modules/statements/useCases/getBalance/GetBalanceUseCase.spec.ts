import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

let createStatementUseCase: CreateStatementUseCase;

describe("Get balance", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory
    )
  });

  it("Should not be able get the balance from a nonexistent user account", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({user_id: "fake_id"});
    }).rejects.toBeInstanceOf(GetBalanceError);
  });

  it("Should be able get the balance from an user account", async () => {
    const user: ICreateUserDTO = {
      name: "renan",
      email: "renan@email.com",
      password: "123"
    };
    
    const createUser = await createUserUseCase.execute(user);
    const user_id = <string>createUser.id;

    await createStatementUseCase.execute({
      user_id,
      type: "deposit" as OperationType,
      amount: 3000,
      description: "It is deposit"
    });

    const balance = await getBalanceUseCase.execute({user_id});

    expect(balance).toHaveProperty("balance", 3000);
    expect(balance.statement[0]).toHaveProperty("id");
    expect(balance.statement[0]).toHaveProperty("user_id");
    expect(balance.statement[0]).toHaveProperty("type", "deposit");
    expect(balance.statement[0]).toHaveProperty("amount", 3000);
  });
});
