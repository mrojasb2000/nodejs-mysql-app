const express = require('express');
const router = express.Router();
const pool = require('../databases');

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };
    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'Links saved successfully');
    res.redirect('/links');
});

router.get('/', async (req, res) => {
    const links = await pool.query('SELECT * FROM links');
    res.render('links/list', { links });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const { affectedRows, serverStatus } = await pool.query('DELETE FROM links WHERE id = ?', [id]);
    if (serverStatus === 2 && affectedRows === 1) {
        console.log(`${id} was removed`);
        res.redirect('/links');
    }
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };
    const { serverStatus, affectedRows } = await pool.query('UPDATE links SET ? WHERE id = ?', [newLink, id]);
    if (serverStatus === 2 && affectedRows === 1) {
        console.log(`${id} was updated`);
        res.redirect('/links');
    }
});


module.exports = router;