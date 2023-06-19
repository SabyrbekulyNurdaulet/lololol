import './AdminPanel.css'

import React, {useState} from 'react'
import Modal from 'react-modal';
import axios from 'axios'

import ProfileImg from '../images/Profile.png'
import Cross from '../images/Cross.png'

export default function AdminPanel({ handleSetIsAuth }) {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [loginIsOpen, setLoginIsOpen] = useState(false)
    const [singupIsOpen, setSingupIsOpen] = useState(false)
    const [account, setAccount] = useState(false)
    const [addItem, setAddItem] = useState(false)

    const [loginMis, setLoginMis] = useState("")
    const [singupMis, setSingupMis] = useState("")

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [title, setTitle] = useState('')
    const [itemImg, setItemImg] = useState(null)
    const [newAvatar, setNewAvatar] = useState(null);

    const Login = async (e) => {
      e.preventDefault();
      if (email === "" || password === "") {
        setSingupMis("Пропущено поле для заполнения.")
      } else {
        try {
          const response = await axios.post("http://localhost:8080/login", { email, password });
          const { token, name, img } = response.data;
          
          localStorage.setItem("isAuth", token);
          localStorage.setItem('userName', name);
          localStorage.setItem('userImage', img);

          handleSetIsAuth(token);
          setName(name);
          setSelectedImage(img);
          setLoginIsOpen(false);
          setAccount(true);
        } catch (error) {
          console.error(error);
          setLoginMis("Неверный логин или пароль");
        }
      }
    }

    const Register = async (e) => {
      e.preventDefault();
      if (name === "" || selectedImage == null || email === "" || password === "" || confirmPassword === "" || confirmPassword !== password) {
        setSingupMis("Пропущено поле или введен неверный пароль. Повторите ввод.")
      } else {
        try {
          const formData = new FormData();
          formData.append("email", email);
          formData.append("password", password);
          formData.append("name", name);
          formData.append("img", selectedImage);
    
          const response = await axios.post('http://localhost:8080/register', formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });

          localStorage.setItem('isAuth', response.data.token);
          localStorage.setItem('userName', name);
          localStorage.setItem('userImage', selectedImage.name);
          handleSetIsAuth(response.data.token);
          setSingupIsOpen(false);
          setAccount(true);
        } catch (error) {
          console.error(error);
          setSingupMis("Пользователь с таким email уже зарегистрирован");
        }
      }
    };    

    const storedName = localStorage.getItem('userName');
    const storedImage = localStorage.getItem('userImage');
    
    function profileIsOpen() {
      if (localStorage.getItem('isAuth') !== null) {
        setAccount(true);
      } else {
        setModalIsOpen(true);
      }
    }

    const handleLogout = () => {
      localStorage.removeItem('isAuth');
      localStorage.removeItem('userName');
      localStorage.removeItem('userImage');
      setName('');
      setSelectedImage(null);
      setAccount(false);
    };

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      setSelectedImage(file); 
    };

    const addItemBtn = async (e) => {
      if (title == '' || itemImg == null) {
        setSingupMis("Пропущено поле для заполнения.")
      } else {
        e.preventDefault();
      
        try {
          const formData = new FormData();
          formData.append("title", title);
          formData.append("img", itemImg);
      
          const response = await axios.post(
            "http://localhost:8080/items",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
      
          console.log("Успешно добавлено");
        } catch (error) {
          console.error(error);
        }
      }
    };
    
    const itemImageChange = (event) => {
      const file = event.target.files[0];
      setItemImg(file); 
    };

    const deleteAvatar = async () => {
      const confirmDelete = window.confirm("Вы точно хотите удалить фото?");
  
      if (confirmDelete) {
        try {
          const token = localStorage.getItem('isAuth');
          
          await axios.delete("http://localhost:8080/avatar", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          localStorage.removeItem('userImage');
          
          setSelectedImage(null);
        } catch (error) {
          console.error(error);
        }
      }
    };

    const avatarChange = (event) => {
      const file = event.target.files[0];
      setNewAvatar(file);
    };
    
    const addNewAvatar = async () => {
      if (newAvatar == null) {
        setSingupMis("Пропущено поле для заполнения.")
      } else {
        try {
          const formData = new FormData();
          formData.append('img', newAvatar);
      
          const response = await axios.post(
            'http://localhost:8080/avatar',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('isAuth')}`, // Включите авторизационный заголовок
              },
            }
          );
          
          const { img } = response.data;
          localStorage.setItem('userImage', newAvatar.name);
          setSelectedImage(img); // Обновите выбранную картинку
          setNewAvatar(null); // Сбросьте выбранную новую картинку
      
          console.log('Новая картинка успешно загружена');
        } catch (error) {
          console.error(error);
        }
      }
    };

    const deleteItemBtn = async () => {
      try {
        await axios.delete(`http://localhost:8080/items/${title}`);
        console.log("Элемент успешно удален");
      } catch (error) {
        console.error(error);
      }
    };
    

  return (
    <div className='Profile'>
        <button className='profile' onClick={() =>profileIsOpen(true)}><img src={ProfileImg} /></button>

        <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className='ModalProfile'>
          <button onClick={() => setModalIsOpen(false)} className='closeProfile'><img src={Cross} /></button>
          <nav className='titleProfile'>Авторизация</nav>
          <button className='logBtn' onClick={() => {setLoginIsOpen(true); setModalIsOpen(false); }}>Войти</button>
          <button className='logBtn' onClick={() => {setSingupIsOpen(true); setModalIsOpen(false); }}>Зарегистрироваться</button>
        </Modal>

        <Modal isOpen={loginIsOpen} onRequestClose={() => setLoginIsOpen(false)} className='ModalProfile'>
          <button onClick={() => setLoginIsOpen(false)} className='closeProfile'><img src={Cross} /></button>
          <nav className='titleProfile'>Вход</nav>
          <input placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
          <input placeholder='Пароль' value={password} onChange={(e) => setPassword(e.target.value)}/>
          <nav className='mistake'>{loginMis}</nav>
          <button className='logBtn' onClick={Login}>Войти</button>
          <nav className='question'>Не регистрировались? <button className='a' onClick={() => {setSingupIsOpen(true); setLoginIsOpen(false); }}>Зарегистрироваться</button></nav>
        </Modal>

        <Modal isOpen={singupIsOpen} onRequestClose={() => setSingupIsOpen(false)} className='ModalProfile'>
          <button onClick={() => setSingupIsOpen(false)} className='closeProfile'><img src={Cross} /></button>
          <nav className='titleProfile'>Регистрация</nav>
          <input placeholder='Имя' value={name} onChange={(e) => setName(e.target.value)}/>
          <input type="file" onChange={handleImageChange} accept="image/*" />
          <input placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
          <input placeholder='Пароль' value={password} onChange={(e) => setPassword(e.target.value)}/>
          <input placeholder='Повторите пароль' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
          <nav className='mistake'>{singupMis}</nav>
          <button className='logBtn' onClick={Register}>Зарегистрироваться</button>
        </Modal>

        <Modal isOpen={account} onRequestClose={() => setAccount(false)} className='ModalProfile'>
          <button onClick={() => setAccount(false)} className='closeProfile'><img src={Cross} /></button>
          <div className='edit'>
            <img className='avatar' src={storedImage ? require(`../images/avatars/${storedImage}`) : require('../images/avatars/logo.png')} />
            <div className='btns'>
              <input type="file" onChange={avatarChange} accept="image/*" />
              <div className='btns'>
                <button className='logBtn' onClick={addNewAvatar}>Загрузить новое фото</button>
                <button className='logBtn' onClick={deleteAvatar}>Удалить фото</button>
                <nav className='mistake'>{singupMis}</nav>
              </div>
            </div>
          </div>
          <nav className='titleProfile'>Добро пожаловать, {storedName}!</nav>
          <button className='logBtn' onClick={() => {setAddItem(true); setAccount(false); }}>Добавить/удалить товар</button>
          <button className='logBtn' onClick={handleLogout}>Выйти</button>
        </Modal>

        <Modal isOpen={addItem} onRequestClose={() => setAddItem(false)} className='ModalProfile'>
          <button onClick={() => setAddItem(false)} className='closeProfile'><img src={Cross} /></button>
          <nav className='titleProfile'>Добавить</nav>
          <nav className='description'> Для удаления введите название товара в строку и нажмите кнопку Удалить</nav>
          <input placeholder='Название' value={title} onChange={(e) => setTitle(e.target.value)}/>
          <input type="file" onChange={itemImageChange} accept="image/*" />
          <button className='logBtn' onClick={addItemBtn}>Добавить</button>
          <button className='logBtn' onClick={deleteItemBtn}>Удалить</button>
          <nav className='mistake'>{singupMis}</nav>
        </Modal>
    </div>
  )
}
