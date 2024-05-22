const app = require('../server.js')
const request = require('supertest')
let server;

beforeAll((done) => {
    server = app.listen(5000, () => {
        console.log('Test server running on port 5000');
        done();
    });
});

afterAll((done) => {
    server.close(() => {
        console.log('Test server closed');
        done();
    });
});

describe('API Tests', () => {
    it('GET /customers - should return all customers', async () => {
        const response = await request(server).get('/customers');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('POST /customers - should create a new customers', async () => {
        const newCustomer = {
            name: 'John',
            lastname: 'DOE',
            email: 'john@example.com',
            phone: '1234567890',
            adress: {
                postalCode: 1234,
                city: 'New York',
                street: '5th Avenue',
              },
            company: true,
        };
        
        const response = await request(server).post('/customers').send(newCustomer);
        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject(newCustomer);
    });
});
