import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;

let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

let createStatementUseCase: CreateStatementUseCase;

describe("Get statement operation", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it("Should not be able to return an user statement operation nonexistent", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "fake_user_id",
        statement_id: "fake_statement_id"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should be able get an extract from account", async () => {
    const user: ICreateUserDTO = {
      name: "renan",
      email: "renam@email.com",
      password: "123",
    };

    const createdUser = await createUserUseCase.execute(user);
    const user_id = <string>createdUser.id;

    const createdStatement = await createStatementUseCase.execute({
      user_id,
      type: "deposit" as OperationType,
      amount: 2000,
      description: "It is deposit",
    });

    const statement_id = <string>createdStatement.id;

    const responseStatement = await getStatementOperationUseCase.execute({
      user_id,
      statement_id,
    });

    expect(responseStatement).toHaveProperty("id");
    expect(responseStatement).toHaveProperty("user_id");
    expect(responseStatement).toHaveProperty("type", "deposit");
    expect(responseStatement).toHaveProperty("amount", 2000);
    expect(responseStatement).toHaveProperty("description", "It is deposit");
  });
});