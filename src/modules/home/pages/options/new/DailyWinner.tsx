import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../../../../../colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Picker } from '@react-native-picker/picker';
import { getDailyWinner, getDailyWinnerDates } from '../../../../../utils/apiservice';

interface Profile {
  profile: string;
  name: string;
  branch: string;
  district: string;
}

const BackgroundImage: React.FC = () => {
  const backgroundImageSource = require('../../../../../assets/images/ic_winner_bg.jpg');

  return (
    <Image source={backgroundImageSource} style={styles.backgroundImage} />
  );
};

const DailyWinner: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [dates, setDates] = useState<string[]>([]);
  const [isDatesLoading, setIsDatesLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    // Use the actual API call to fetch dates
    getDailyWinnerDates()
      .then(response => response.json())
      .then(data => {
        const dateList = data.map(item => item.date);
        setDates(dateList);
        setIsDatesLoading(false);
      })
      .catch(error => {
        console.error('Error fetching dates:', error);
        setIsDatesLoading(false);
      });
  }, []);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    sendDate(date);
  };

  const sendDate = (selectedDate: string) => {
    getDailyWinner(selectedDate)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          const updatedProfiles = data.map((item: Profile) => {
            if (item.profile) {
              item.profile = `https://www.vguardrishta.com/img/appImages/Profile/${item.profile}`;
            }
            return item;
          });
          setProfiles(updatedProfiles);
          console.log('POST request response:', updatedProfiles);
        } else {
          console.error(data);
        }
      })
      .catch(error => {
        console.error('Error making POST request:', error);
      });
  };

  const groupedProfiles: Profile[][] = [];
  for (let i = 0; i < profiles.length; i += 2) {
    groupedProfiles.push(profiles.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      <BackgroundImage />
      <Text style={styles.title}>Daily Winner</Text>
      <ScrollView style={styles.contentContainer}>
        <View style={styles.pickerContainer}>
          <View style={styles.inputContainer}>
            {isDatesLoading ? (
              <Text style={styles.blackText}>Loading dates...</Text>
            ) : dates.length === 0 ? (
              <Text style={styles.blackText}>No dates available.</Text>
            ) : (
              <Picker
                selectedValue={selectedDate}
                onValueChange={handleDateChange}
                style={styles.picker}
              >
                {dates.map(date => (
                  <Picker.Item key={date} label={date} value={date} />
                ))}
              </Picker>
            )}
          </View>
        </View>
        <View style={styles.profilesContainer}>
          {groupedProfiles.map((profilePair, index) => (
            <View key={index} style={styles.profileRow}>
              {profilePair.map((profile, subIndex) => (
                <ProfileCard key={subIndex} profile={profile} />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

interface ProfileCardProps {
  profile: Profile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <TouchableOpacity style={styles.profileCard}>
      <View style={styles.crownImage}>
        <Image style={{ flex: 1, width: '100%', height: '100%' }}
          resizeMode="contain" source={require('../../../../../assets/images/ic_winner_.png')} />
      </View>
      <Image
        source={{ uri: profile.profile }}
        style={styles.profileImage}
      />
      <Text style={styles.profileName}>{profile.name}</Text>
      <Text style={styles.profileBranch}>{profile.branch}</Text>
      <Text style={styles.profileDistrict}>{profile.district}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: responsiveHeight(10),
  },
  contentContainer: {
    padding: 15,
  },
  inputContainer: {
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: colors.black,
    width: responsiveWidth(50),
    backgroundColor: colors.lightGrey,
  },
  picker: {
    color: colors.black,
    width: '100%',
    fontSize: responsiveFontSize(1.5),
  },
  blackText: {
    fontSize: responsiveFontSize(2),
    color: colors.black,
  },
  pickerContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  profilesContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  profileCard: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 5,
    borderColor: colors.white
  },
  crownImage: {
    width: 50,
    height: 50,
  },
  profileName: {
    fontSize: responsiveFontSize(2),
    color: colors.black,
    fontWeight: 'bold',
  },
  profileBranch: {
    fontSize: responsiveFontSize(1.5),
    color: colors.black,
  },
  profileDistrict: {
    fontSize: responsiveFontSize(1.5),
    color: colors.black,
  },
});

export default DailyWinner;
