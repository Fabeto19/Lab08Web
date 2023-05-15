const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');


const router = express.Router();
router.post(
    '/',
    [
      body('name').notEmpty().withMessage('El nombre es requerido'),
      body('email').isEmail().withMessage('El email no es válido'),
      body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    ],
    async (req, res) => {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Mostrar mensajes de error en la interfaz de usuario
        return res.render('index', { errors: errors.array() });
      }
  
      // Resto de la lógica para crear un nuevo usuario
    }
  );
  
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

router.get('/', async (req, res) => {
  const users = await User.find();
  res.render('index', { users });
});

router.post('/', async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Crear un nuevo usuario con la contraseña encriptada
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
  
      // Guardar el nuevo usuario en la base de datos
      await newUser.save();
  
      res.redirect('/users');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al crear el usuario');
    }
  });
  


router.get('/edit/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render('partials/edit', { user });
});

router.post('/update/:id', async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/users');
});

router.get('/delete/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/users');
});

module.exports = router;