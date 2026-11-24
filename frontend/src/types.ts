/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActiveView = 'landing' | 'chat' | 'documents';

export interface SourceCitation {
  title: string;
  link?: string;
  icon?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: SourceCitation[];
}

export interface SafetyDocument {
  id: string;
  title: string;
  type: string;
  size: string;
  category: string;
  uploadDate: string;
  status: 'Indexed' | 'Processing';
}

export interface KeywordHit {
  word: string;
  hits: string;
  critical?: boolean;
}

export interface TopicVolume {
  label: string;
  volume: number;
}
