import React from 'react';
import {
  Droplets, Smartphone, Dumbbell, PersonStanding, Utensils,
  Bed, BookOpen, Coffee, Brain, Smile,
  Sun, Moon, Heart, Music, Pencil,
  Sunrise, Sunset, Sprout, CloudSun, Plus,
  Zap, Target, CheckCircle2, Flame, Star,
  MapPin, ChevronRight, ChevronLeft, X, GripVertical,
  Award, Clock, BarChart3, Settings, ClipboardList, MoreVertical, Search, RefreshCw, Shield, FileText, Upload
} from 'lucide-react';

const ICON_MAP = {
  droplets: Droplets,
  smartphone: Smartphone,
  dumbbell: Dumbbell,
  'person-standing': PersonStanding,
  utensils: Utensils,
  bed: Bed,
  'book-open': BookOpen,
  coffee: Coffee,
  brain: Brain,
  smile: Smile,
  sun: Sun,
  moon: Moon,
  heart: Heart,
  music: Music,
  pencil: Pencil,
  sunrise: Sunrise,
  sunset: Sunset,
  sprout: Sprout,
  'cloud-sun': CloudSun,
  plus: Plus,
  zap: Zap,
  target: Target,
  'check-circle': CheckCircle2,
  flame: Flame,
  star: Star,
  'map-pin': MapPin,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  x: X,
  'grip-vertical': GripVertical,
  award: Award,
  clock: Clock,
  'bar-chart': BarChart3,
  settings: Settings,
  'clipboard-list': ClipboardList,
  'more-vertical': MoreVertical,
  search: Search,
  'refresh-cw': RefreshCw,
  shield: Shield,
  'file-text': FileText,
  upload: Upload,
};

export default function Icon({ name, size = 24, color, className, style, ...rest }) {
  const IconComponent = ICON_MAP[name];
  if (!IconComponent) return <span style={{ width: size, height: size, display: 'inline-block' }} />;
  return <IconComponent size={size} color={color} className={className} style={style} {...rest} />;
}
