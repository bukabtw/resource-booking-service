from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Настройки приложения, читаемые из переменных окружения."""

    app_name: str = "Resource Booking Service API"
    database_url: str = "sqlite:///./booking.db"
    cors_origins: list[str] = ["*"]

    model_config = SettingsConfigDict(env_file=".env", env_prefix="RBS_")


settings = Settings()
