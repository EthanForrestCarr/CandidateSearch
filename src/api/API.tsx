const searchGithub = async (query: string, page: number = 1) => {
  try {
    console.log(import.meta.env);
    const response = await fetch(
      `https://api.github.com/search/users?q=${query}&page=${page}&per_page=30`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
        },
      }
    );
    console.log('Response:', response.status);
    const data = await response.json();
    console.log('Fetched Users:', data.items);
    if (!response.ok) {
      throw new Error('Invalid API response, check the network tab');
    }
    return data.items;
  } catch (err) {
    console.log('An error occurred', err);
    return [];
  }
};

const searchGithubUser = async (username: string) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error('Invalid API response, check the network tab');
    }
    return data;
  } catch (err) {
    console.log('An error occurred', err);
    return {};
  }
};

export { searchGithub, searchGithubUser };