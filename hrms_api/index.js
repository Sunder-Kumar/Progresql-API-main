const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', async (req, res) => {
    try {
        const result =await pool.query(`
            select e.employee_id,concat(e.first_name,' ',e.last_name) as "Full Name",
            e.salary,e.email,e.phone_number,e.commission_pct,d.department_name,
            j.job_title,l.street_address,l.postal_code,l.city,l.state_province,
            c.country_name,r.region_name
            from employees e inner join departments d
            on e.department_id = d.department_id
            inner join jobs j
            on e.job_id = j.job_id 
            inner join locations l
            on d.location_id = l.location_id
            inner join countries c
            on c.country_id = l.country_id
            inner join regions r
            on r.region_id = c.region_id
            `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/:id', async (req, res) => {
    try {
        const result =await pool.query(`
            select e.employee_id,concat(e.first_name,' ',e.last_name) as "Full Name",
            e.salary,e.email,e.phone_number,e.commission_pct,d.department_name,
            j.job_title,l.street_address,l.postal_code,l.city,l.state_province,
            c.country_name,r.region_name
            from employees e inner join departments d
            on e.department_id = d.department_id
            inner join jobs j
            on e.job_id = j.job_id 
            inner join locations l
            on d.location_id = l.location_id
            inner join countries c
            on c.country_id = l.country_id
            inner join regions r
            on r.region_id = c.region_id where e.employee_id = $1`,[req.params.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//EMPLOYEES API'S
app.get('/employees', async (req, res) => {
    const r = await pool.query('SELECT * FROM employees');
    res.json(r.rows);
});

app.get('/employees/:id', async (req, res) => {
    const r = await pool.query(
        'SELECT * FROM employees WHERE employee_id=$1', [req.params.id]
    );
    res.json(r.rows[0]);
});

app.post('/employees', async (req, res) => {
    const {
        first_name, last_name, email, phone_number,
        hire_date, job_id, salary, commission_pct,
        manager_id, department_id
    } = req.body;

    const r = await pool.query(
        `INSERT INTO employees
     (first_name,last_name,email,phone_number,hire_date,
      job_id,salary,commission_pct,manager_id,department_id)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [first_name, last_name, email, phone_number, hire_date,
            job_id, salary, commission_pct, manager_id, department_id]
    );
    res.json(r.rows[0]);
});

app.put('/employees/:id', async (req, res) => {
    const { salary, department_id, manager_id } = req.body;
    const r = await pool.query(
        `UPDATE employees SET salary=$1,department_id=$2,manager_id=$3
     WHERE employee_id=$4 RETURNING *`,
        [salary, department_id, manager_id, req.params.id]
    );
    res.json(r.rows[0]);
});

app.delete('/employees/:id', async (req, res) => {
    await pool.query('DELETE FROM employees WHERE employee_id=$1', [req.params.id]);
    res.json({ message: 'Employee deleted' });
});


//Departments API'S
app.get('/departments', async (req, res) => {
    const r = await pool.query('SELECT * FROM departments');
    res.json(r.rows);
});

app.get('/departments/:id', async (req, res) => {
    const r = await pool.query(
        'SELECT * FROM departments WHERE department_id=$1', [req.params.id]
    );
    res.json(r.rows[0]);
});

app.post('/departments', async (req, res) => {
    const { department_name, manager_id, location_id } = req.body;
    const r = await pool.query(
        `INSERT INTO departments(department_name,manager_id,location_id)
     VALUES($1,$2,$3) RETURNING *`,
        [department_name, manager_id, location_id]
    );
    res.json(r.rows[0]);
});

app.put('/departments/:id', async (req, res) => {
    const { department_name, manager_id, location_id } = req.body;
    const r = await pool.query(
        `UPDATE departments SET
     department_name=$1, manager_id=$2, location_id=$3
     WHERE department_id=$4 RETURNING *`,
        [department_name, manager_id, location_id, req.params.id]
    );
    res.json(r.rows[0]);
});

app.delete('/departments/:id', async (req, res) => {
    await pool.query('DELETE FROM departments WHERE department_id=$1', [req.params.id]);
    res.json({ message: 'Department deleted' });
});


//LOCATIONS API'S
app.get('/locations', async (req, res) => {
    const r = await pool.query('SELECT * FROM locations');
    res.json(r.rows);
});

app.get('/locations/:id', async (req, res) => {
    const r = await pool.query(
        'SELECT * FROM locations WHERE location_id=$1', [req.params.id]
    );
    res.json(r.rows[0]);
});

app.post('/locations', async (req, res) => {
    const {
        street_address, postal_code, city,
        state_province, country_id
    } = req.body;

    const r = await pool.query(
        `INSERT INTO locations
     (street_address,postal_code,city,state_province,country_id)
     VALUES($1,$2,$3,$4,$5) RETURNING *`,
        [street_address, postal_code, city, state_province, country_id]
    );
    res.json(r.rows[0]);
});

app.put('/locations/:id', async (req, res) => {
    const {
        street_address, postal_code, city,
        state_province, country_id
    } = req.body;

    const r = await pool.query(
        `UPDATE locations SET
     street_address=$1, postal_code=$2, city=$3,
     state_province=$4, country_id=$5
     WHERE location_id=$6 RETURNING *`,
        [street_address, postal_code, city, state_province, country_id, req.params.id]
    );
    res.json(r.rows[0]);
});

app.delete('/locations/:id', async (req, res) => {
    await pool.query('DELETE FROM locations WHERE location_id=$1', [req.params.id]);
    res.json({ message: 'Location deleted' });
});





//COUNTRIES API's

app.get('/countries', async (req, res) => {
    const r = await pool.query('SELECT * FROM countries');
    res.json(r.rows);
});

app.get('/countries/:id', async (req, res) => {
    const r = await pool.query(
        'SELECT * FROM countries WHERE country_id=$1', [req.params.id]
    );
    res.json(r.rows[0]);
});

app.post('/countries', async (req, res) => {
    const { country_id, country_name, region_id } = req.body;
    const r = await pool.query(
        `INSERT INTO countries VALUES($1,$2,$3) RETURNING *`,
        [country_id, country_name, region_id]
    );
    res.json(r.rows[0]);
});

app.put('/countries/:id', async (req, res) => {
    const { country_name, region_id } = req.body;
    const r = await pool.query(
        `UPDATE countries SET country_name=$1, region_id=$2
     WHERE country_id=$3 RETURNING *`,
        [country_name, region_id, req.params.id]
    );
    res.json(r.rows[0]);
});

app.delete('/countries/:id', async (req, res) => {
    await pool.query('DELETE FROM countries WHERE country_id=$1', [req.params.id]);
    res.json({ message: 'Country deleted' });
});


//REGIONS API's
app.get('/regions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM regions');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

app.get('/regions/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM regions WHERE region_id=$1', [req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

app.post('/regions', async (req, res) => {
    try {
        const { region_name } = req.body;
        const result = await pool.query(
            'INSERT INTO regions(region_name) VALUES($1) RETURNING *',
            [region_name]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
})

app.put('/regions/:id', async (req, res) => {
    try {
        const { region_name } = req.body;
        const result = await pool.query(
            'UPDATE regions SET region_name=$1 WHERE region_id=$2 RETURNING *',
            [region_name, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`);
});