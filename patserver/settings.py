from pydantic import BaseModel, SecretStr, BaseSettings, validator, PostgresDsn
from os import environ, path
from loguru import logger


class PostgresSettings(BaseModel):
    host: str = "127.0.0.1"
    db: str = "pats"
    user: str = "postgres"
    password: SecretStr = SecretStr("")
    port: int = 5432
    dsn: SecretStr = None

    @validator("dsn", always=True)
    def generate_dsn(cls, v, values, **kwargs) -> SecretStr:
        dsn = PostgresDsn.build(
            scheme="postgresql",
            user=values.get("user"),
            port=str(values.get("port")),
            password=values.get("password").get_secret_value(),
            host=values.get("host"),
            path=f"/{values.get('db')}"
        )
        return SecretStr(dsn)


class AppSettings(BaseModel):
    port: int = 5000
    listen_host: str = "0.0.0.0"


class Settings(BaseSettings):
    db: PostgresSettings = PostgresSettings()
    app: AppSettings = AppSettings()

    class Config:
        env_nested_delimiter = "__"
        try:
            if path.isfile(".env"):
                env_file = ".env"
            else:
                env_file = environ["CONF"]
        except KeyError:
            logger.warning("env var 'CONF' is not set")
        env_file_encoding = "utf-8"


settings = Settings()
