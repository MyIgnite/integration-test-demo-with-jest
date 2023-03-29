import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create statement", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });

  it("Should be able to make a deposit in account", async () => {
    const user: ICreateUserDTO = {
      name: "renan",
      email: "renan@email.com",
      password: '123'
    };

    const userCreated = await createUserUseCase.execute(user);
    const idUser = <string>userCreated.id;

    const createdStatement = await createStatementUseCase.execute({
      user_id: idUser,
      type: "deposit" as OperationType,
      amount: 1000,
      description: "It is deposit"
    });

    expect(createdStatement).toHaveProperty("id");
    expect(createdStatement).toHaveProperty("user_id");
    expect(createdStatement).toHaveProperty("type", createdStatement.type);
    expect(createdStatement).toHaveProperty("amount", createdStatement.amount);
    expect(createdStatement).toHaveProperty("description", createdStatement.description);
  });
})