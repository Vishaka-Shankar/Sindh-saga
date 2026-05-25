/**
 * Navbar.tsx — Premium responsive top navigation bar with search & scroll animation.
 * Location: components/culture/
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { SagaColors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { useLoading } from '@/context/LoadingContext';
import { useScroll } from '@/context/ScrollContext';
import { MOCK_STORIES, type MockStory } from '@/data/mockStories';
import { ROUTES } from '@/navigation/routes';
import { AjrakMotif } from './svg/AjrakMotif';

type NavbarProps = {
  onOpenDrawer: () => void;
};

export function Navbar({ onOpenDrawer }: NavbarProps) {
  const router = useRouter();
  const { scrolled } = useScroll();
  const { simulateAPILoad } = useLoading();
  const { width: windowWidth } = useWindowDimensions();

  const isMobile = windowWidth <= 768;
  const inputRef = useRef<TextInput>(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchResults, setSearchResults] = useState<MockStory[]>([]);

  // Reanimated shared values for scroll transition
  const navHeight = useSharedValue(80);
  const navBg = useSharedValue('rgba(250, 243, 224, 0)');
  const navBorder = useSharedValue('rgba(221, 211, 188, 0)');

  // Reanimated shared values for search expansion
  const searchWidth = useSharedValue(0);

  useEffect(() => {
    if (scrolled) {
      navHeight.value = withTiming(62, { duration: 250 });
      navBg.value = withTiming(SagaColors.ivory, { duration: 250 });
      navBorder.value = withTiming(SagaColors.border, { duration: 250 });
    } else {
      navHeight.value = withTiming(80, { duration: 250 });
      navBg.value = withTiming('rgba(250, 243, 224, 0)', { duration: 250 });
      navBorder.value = withTiming('rgba(221, 211, 188, 0)', { duration: 250 });
    }
  }, [scrolled, navHeight, navBg, navBorder]);

  useEffect(() => {
    if (isSearchExpanded) {
      searchWidth.value = withTiming(isMobile ? 160 : 240, { duration: 250 });
    } else {
      searchWidth.value = withTiming(0, { duration: 250 });
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isSearchExpanded, isMobile, searchWidth]);

  // Search logic
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setSearchResults([]);
    } else {
      const matches = MOCK_STORIES.filter(
        (story) =>
          story.title.toLowerCase().includes(text.toLowerCase()) ||
          story.excerpt.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(matches);
    }
  };

  const handleSearchResultSelect = (id: string) => {
    setIsSearchExpanded(false);
    simulateAPILoad(600);
    router.push(ROUTES.storyDetail(id));
  };

  const handleNavigate = (route: any) => {
    simulateAPILoad(500);
    router.push(route);
  };

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: navHeight.value,
      backgroundColor: navBg.value,
      borderBottomColor: navBorder.value,
      borderBottomWidth: scrolled ? 1 : 0,
    };
  });

  const searchAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: searchWidth.value,
      opacity: searchWidth.value > 0 ? 1 : 0,
      marginRight: searchWidth.value > 0 ? 8 : 0,
    };
  });

  return (
    <Animated.View style={[styles.navbar, containerAnimatedStyle]}>
      <View style={styles.content}>
        {/* Left Section: Logo & Ajrak Motif */}
        <Pressable
          style={styles.brand}
          onPress={() => handleNavigate(ROUTES.home)}
        >
          <AjrakMotif size={28} />
          <Text style={styles.logoText}>Sindh Saba</Text>
        </Pressable>

        {/* Center Section: Desktop Nav Links */}
        {!isMobile && (
          <View style={styles.navLinks}>
            {[
              { label: 'Home', route: ROUTES.home },
              { label: 'Explore', route: ROUTES.stories },
              { label: 'About', route: ROUTES.about },
              { label: 'Contact', route: ROUTES.contact },
            ].map((link) => (
              <Pressable
                key={link.label}
                onPress={() => handleNavigate(link.route)}
                style={styles.navLinkItem}
              >
                <Text style={styles.navLinkLabel}>{link.label}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Right Section: Inline Search & Mobile Hamburger */}
        <View style={styles.actions}>
          {/* Expanding Search Bar Wrapper */}
          <View style={styles.searchWrapper}>
            <Animated.View style={[styles.searchContainer, searchAnimatedStyle]}>
              <TextInput
                ref={inputRef}
                value={searchQuery}
                onChangeText={handleSearchChange}
                placeholder="Search stories..."
                placeholderTextColor={SagaColors.textMuted}
                style={styles.searchInput}
                onBlur={() => {
                  if (searchQuery.trim() === '') {
                    setIsSearchExpanded(false);
                  }
                }}
              />
            </Animated.View>
            <Pressable
              onPress={() => {
                if (isSearchExpanded) {
                  if (searchQuery.trim() !== '') {
                    // Triggers search
                  } else {
                    setIsSearchExpanded(false);
                  }
                } else {
                  setIsSearchExpanded(true);
                  setTimeout(() => inputRef.current?.focus(), 100);
                }
              }}
              style={styles.actionBtn}
            >
              <Ionicons
                name="search-outline"
                size={22}
                color={SagaColors.deepIndigo}
              />
            </Pressable>
          </View>

          {/* Hamburger Menu (Mobile Only) */}
          {isMobile && (
            <Pressable style={styles.actionBtn} onPress={onOpenDrawer}>
              <Ionicons
                name="menu-outline"
                size={26}
                color={SagaColors.deepIndigo}
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* Floating Dropdown Results Panel */}
      {isSearchExpanded && searchQuery.trim() !== '' && (
        <View style={styles.dropdownPanel}>
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.dropdownItem,
                    pressed && styles.dropdownItemPressed,
                  ]}
                  onPress={() => handleSearchResultSelect(item.id)}
                >
                  <Text style={styles.dropdownTitle}>{item.title}</Text>
                  <Text style={styles.dropdownExcerpt} numberOfLines={1}>
                    {item.excerpt}
                  </Text>
                </Pressable>
              )}
            />
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No stories match your search</Text>
            </View>
          )}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9990,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: '100%',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    ...Typography.overline,
    color: SagaColors.deepIndigo,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  navLinkItem: {
    paddingVertical: 8,
  },
  navLinkLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: SagaColors.textMuted,
    letterSpacing: 0.2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    height: 38,
    backgroundColor: 'rgba(27, 42, 107, 0.06)',
    borderRadius: 19,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(27, 42, 107, 0.12)',
  },
  searchInput: {
    fontSize: 13,
    color: SagaColors.deepIndigo,
    padding: 0,
    width: '100%',
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(27, 42, 107, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownPanel: {
    position: 'absolute',
    top: '100%',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    maxHeight: 240,
    shadowColor: SagaColors.deepIndigo,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: SagaColors.border,
    overflow: 'hidden',
    marginTop: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(27, 42, 107, 0.06)',
  },
  dropdownItemPressed: {
    backgroundColor: 'rgba(27, 42, 107, 0.05)',
  },
  dropdownTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: SagaColors.deepIndigo,
  },
  dropdownExcerpt: {
    fontSize: 11,
    color: SagaColors.textMuted,
    marginTop: 2,
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 13,
    color: SagaColors.textMuted,
    fontStyle: 'italic',
  },
});
