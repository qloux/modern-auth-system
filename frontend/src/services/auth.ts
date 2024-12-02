interface User {
  email: string;
  password: string;
}

// Имитация базы данных пользователей
let users: User[] = [];

export const register = async (email: string, password: string): Promise<boolean> => {
  // Проверяем, существует ли уже пользователь
  if (users.some(user => user.email === email)) {
    throw new Error('Пользователь с таким email уже существует');
  }

  // Добавляем нового пользователя
  users.push({ email, password });
  return true;
};

export const login = async (email: string, password: string): Promise<boolean> => {
  // Имитируем задержку сети
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Проверяем учетные данные
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Неверный email или пароль');
  }

  return true;
};

export const loginWithSocial = async (provider: string): Promise<boolean> => {
  // Имитируем задержку сети
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // В реальном приложении здесь будет логика OAuth
  console.log(`Вход через ${provider}`);
  return true;
};
