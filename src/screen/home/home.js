import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { ImageResource } from '../../resource/imageResource';
import AppButton from '../../components/AppButton';
import { Colors, FontFamily, FontSize, Spacing } from '../../theme/theme';
import { DIMENSIONS } from '../../utils/constant';
import { styles } from './style';

export default function Home({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.illustrationWrapper}>
          <Image
            source={ImageResource.logo.home_logo}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.headline}>Welcome To Quiz App!</Text>
          <Text style={styles.subheadline}>
            Create and play quizzes whenever and wherever you want
          </Text>
        </View>

        <View style={styles.buttonBlock}>
          <AppButton
            label="Add Quiz"
            onPress={() => navigation.navigate('Auth')}
            variant="filled"
          />

          <View style={styles.btnSpacer} />

          <AppButton
            label="Let's Play"
            onPress={() => navigation.navigate('StudentAuth')}
            variant="filled"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
