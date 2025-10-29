const pool = require('../database/dbConfig');

class Country {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS countries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        capital VARCHAR(255),
        region VARCHAR(255),
        population BIGINT NOT NULL,
        currency_code VARCHAR(10),
        exchange_rate NUMERIC(20, 6),
        estimated_gdp NUMERIC(30, 6),
        flag_url VARCHAR(500),
        last_refreshed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
  }

  static async upsert(countryData) {
    const query = `
      INSERT INTO countries 
      (name, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url, last_refreshed_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
      ON CONFLICT (name) DO UPDATE SET
        capital = EXCLUDED.capital,
        region = EXCLUDED.region,
        population = EXCLUDED.population,
        currency_code = EXCLUDED.currency_code,
        exchange_rate = EXCLUDED.exchange_rate,
        estimated_gdp = EXCLUDED.estimated_gdp,
        flag_url = EXCLUDED.flag_url,
        last_refreshed_at = CURRENT_TIMESTAMP
    `;

    const values = [
      countryData.name,
      countryData.capital,
      countryData.region,
      countryData.population,
      countryData.currency_code,
      countryData.exchange_rate,
      countryData.estimated_gdp,
      countryData.flag_url
    ];

    await pool.query(query, values);
  }

  static async findAll(filters = {}) {
    let query = `SELECT * FROM countries WHERE 1=1`;
    const values = [];
    let paramIndex = 1;

    if (filters.region) {
      query += ` AND region = $${paramIndex++}`;
      values.push(filters.region);
    }

    if (filters.currency) {
      query += ` AND currency_code = $${paramIndex++}`;
      values.push(filters.currency);
    }

    if (filters.sort) {
      const sortMapping = {
        gdp_desc: 'estimated_gdp DESC',
        gdp_asc: 'estimated_gdp ASC',
        population_desc: 'population DESC',
        population_asc: 'population ASC'
      };
      query += ` ORDER BY ${sortMapping[filters.sort] || 'name ASC'}`;
    } else {
      query += ` ORDER BY name ASC`;
    }

    const { rows } = await pool.query(query, values);
    return rows;
  }

  static async findByName(name) {
    const { rows } = await pool.query(
      'SELECT * FROM countries WHERE LOWER(name) = LOWER($1)',
      [name]
    );
    return rows[0];
  }

  static async deleteByName(name) {
    const result = await pool.query(
      'DELETE FROM countries WHERE LOWER(name) = LOWER($1)',
      [name]
    );
    return result.rowCount > 0;
  }

  static async getStats() {
    const { rows } = await pool.query(`
      SELECT 
        COUNT(*) AS total_countries,
        MAX(last_refreshed_at) AS last_refreshed_at
      FROM countries
    `);
    return rows[0];
  }
}

module.exports = Country;
