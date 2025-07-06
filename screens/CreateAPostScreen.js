import { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import Modal from 'react-modal'; // Commented out for MVP
import { useAuth } from '../contexts1/AuthContext';
import { styles } from '../styles/CreateAPostStyles';

// Modal.setAppElement('#root'); // Commented out for MVP

const CreateAPostScreen = ({ navigation }) => {
  // const today = new Date(); // Commented out for MVP
  // const currentYear = today.getFullYear(); // Commented out for MVP
  const { user: currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // Date/Time selection state - Commented out for MVP
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedDate, setSelectedDate] = useState(null);
  // const [month, setMonth] = useState(today.getMonth());
  // const [day, setDay] = useState(today.getDate());
  // const [year, setYear] = useState(today.getFullYear());
  // const [hour, setHour] = useState('12');
  // const [minute, setMinute] = useState('00');
  // const [ampm, setAmpm] = useState('AM');

  // Date/Time helper arrays and functions - Commented out for MVP
  // const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  // const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  // const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  // const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  // const getDaysInMonth = (month, year) => new Date(year, typeof month === 'string' ? months.indexOf(month) + 1 : month + 1, 0).getDate();
  // const days = Array.from({ length: getDaysInMonth(month, year) }, (_, i) => String(i + 1).padStart(2, '0'));

  // const handleConfirm = () => {
  //   let finalHour = parseInt(hour);
  //   if (ampm === 'PM' && finalHour !== 12) finalHour += 12;
  //   if (ampm === 'AM' && finalHour === 12) finalHour = 0;
  //   const finalDate = new Date(year, months.indexOf(month), parseInt(day), finalHour, parseInt(minute));
  //   setSelectedDate(finalDate);
  //   setIsModalOpen(false);
  // };

  // useEffect(() => {
  //   const maxDay = getDaysInMonth(month, year);
  //   if (parseInt(day) > maxDay) {
  //     setDay(String(maxDay).padStart(2, '0'));
  //   }
  // }, [month, year]);

  // const formatDateTime = (date) => {
  //   if (!date) return 'Now';
  //   const formattedMonth = months[date.getMonth()];
  //   const day = date.getDate();
  //   const year = date.getFullYear();
  //   let hour = date.getHours();
  //   const minute = date.getMinutes().toString().padStart(2, '0');
  //   const ampm = hour >= 12 ? 'PM' : 'AM';
  //   hour = hour % 12;
  //   hour = hour ? hour : 12;
  //   return `${formattedMonth} ${day}, ${year}, ${hour}:${minute} ${ampm}`;
  // };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icn_arrow_back.png')} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo_artizen.png')} style={styles.logo} resizeMode="contain" />
        </View>
      </View>

      <View style={styles.profileTextContainer}>
        <Text style={styles.profileName}>Create a New Post</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.bigInput}
          placeholder="Write A Post..."
          placeholderTextColor="#999"
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={500}
        />

        {/* Date/Time selection UI - Commented out for MVP */}
        {/* <View style={styles.dateTimeBox}>
          <Text style={styles.nowText}>{formatDateTime(selectedDate)}</Text>
          <TouchableOpacity onPress={() => setIsModalOpen(true)}>
            <Image source={require('../assets/icn_calender.png')} style={styles.calendarIcon} />
          </TouchableOpacity>
        </View> */}

        <TouchableOpacity
          style={styles.updateButton}
          onPress={async () => {
            if (!title.trim() || !content.trim()) {
              alert('Please enter both title and content');
              return;
            }

            const postBody = {
              title,
              content,
              date: new Date(), // Always use current date/time for MVP
              userEmail: currentUser.email,
              fullName: currentUser.fullName,
              profileImage: currentUser.profileImage,
            };

            try {
              const res = await fetch('https://api.artizen.world/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postBody),
              });

              const data = await res.json();
              if (res.ok) {
                navigation.navigate('PostPage', {
                  title,
                  content,
                  fullName: currentUser.fullName,
                  profileImage: currentUser.profileImage,
                });
              } else {
                alert(data.message || 'Error creating post.');
              }
            } catch (err) {
              console.error('Post creation error:', err);
              alert('Something went wrong.');
            }
          }}
        >
          <Text style={styles.updateButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Date/Time selection Modal - Commented out for MVP */}
      {/* <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            maxWidth: 650,
            margin: 'auto',
            borderRadius: 10,
            padding: 20,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            position: 'relative'
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
        }}
      >
        <TouchableOpacity style={{ position: 'absolute', top: 10, right: 15, zIndex: 10 }} onPress={() => setIsModalOpen(false)}>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }}>×</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Select Date</Text>
        <View style={styles.row}>
          <select value={month} onChange={(e) => setMonth(e.target.value)} style={styles.select}>
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <Text style={styles.separator}>/</Text>
          <select value={day} onChange={(e) => setDay(e.target.value)} style={styles.select}>
            {days.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <Text style={styles.separator}>/</Text>
          <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} style={styles.select}>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </View>

        <Text style={styles.sectionTitle}>Select Time</Text>
        <View style={styles.row}>
          <select value={hour} onChange={(e) => setHour(e.target.value)} style={styles.select}>
            {hours.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
          <Text style={styles.separator}>:</Text>
          <select value={minute} onChange={(e) => setMinute(e.target.value)} style={styles.select}>
            {minutes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select value={ampm} onChange={(e) => setAmpm(e.target.value)} style={styles.select}>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </View>

        <button onClick={handleConfirm} style={styles.confirmButton}>Select</button>
      </Modal> */}
    </View>
  );
};

export default CreateAPostScreen;