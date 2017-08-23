const request = jest.fn(() => Promise.resolve("[]"));
jest.mock('request-promise-native', () => ( request ));

import { retrieveRepositories } from '../github';

describe('retrieveRepositories()', () => {
    const user = { accessToken: 'fbz', displayName: 'Foo', id: 42, username: 'foo' };
    const body = JSON.stringify([
        { id: 1296269, full_name: 'octocat/Hello-World', },
        { id: 1296270, full_name: 'octocat/Hello-Universe', }
    ]);

    afterEach(() => {
        request.mockClear();
    });

    it('should GET https://api.github.com/user/repos', async () => {
        // Act
        await retrieveRepositories(user);

        // Arrange
        expect(request.mock.calls[0][0].url).toBe('https://api.github.com/user/repos');
    });
    
    it('should add an Authorization header', async () => {
        // Act
        await retrieveRepositories(user);

        // Arrange
        expect(request.mock.calls[0][0].headers['Authorization']).toBe(`token ${user.accessToken}`);
    });

    it('should add an User-Agent header', async () => {
        // See https://developer.github.com/v3/#user-agent-required
        
        // Act
        await retrieveRepositories(user);
        
        // Arrange
        expect(request.mock.calls[0][0].headers['User-Agent']).toBeDefined();
    });
    
    it('should return the response body from GitHub', async () => {
        // Arrange
        request.mockImplementation(() => Promise.resolve(body))

        // Act
        const result = await retrieveRepositories(user);

        // Arrange
        expect(result).toEqual([
            { id: 1296269, fullName: 'octocat/Hello-World', },
            { id: 1296270, fullName: 'octocat/Hello-Universe', }
        ]);
    });

});