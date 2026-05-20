import { callService } from '../gateway/helpers/http.helper';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HttpHelper', () => {
  const url = 'http://localhost:3001/graphql';
  const query = 'query { test }';

  it('should return data on success', async () => {
    mockedAxios.post.mockResolvedValue({
      data: { data: { test: 'success' } },
    });

    const result = await callService(url, query);
    expect(result).toEqual({ test: 'success' });
    expect(mockedAxios.post).toHaveBeenCalledWith(url, { query, variables: undefined }, expect.any(Object));
  });

  it('should throw error if response contains errors', async () => {
    mockedAxios.post.mockResolvedValue({
      data: { errors: [{ message: 'GraphQL Error' }] },
    });

    await expect(callService(url, query)).rejects.toThrow('GraphQL Error');
  });

  it('should throw service error on network failure', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Network Error'));

    await expect(callService(url, query)).rejects.toThrow('Service error: Network Error');
  });
});
