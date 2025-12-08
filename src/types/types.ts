import {СITIES} from '../data/constant';
import { JSX } from 'react';

export type jsxElementNull = JSX.Element | null;

export type HousingRange = 'apartment' | 'room' | 'house' | 'hotel';

export type TOffers = {
  id: string;
  price: number;
  title: string;
  type: HousingRange;
  city: City;
  location: TLocation;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  previewImage: string;
  favorites?: boolean;
};

export type TOffer = {
  bedrooms: number;
  city: {
    name: string;
    location: TLocation;
  };
  description: string;
  goods: string[];
  host: { isPro: boolean; name: string; avatarUrl: string };
  id: string;
  images: string[];
  isFavorite: boolean;
  isPremium: boolean;
  location: { latitude: number; longitude: number; zoom: number };
  maxAdults: number;
  price: number;
  rating: number;
  title: string;
  type: string;
};

export type TDataOfferProps = { data: TOffer };

export type TOffersProp = {
  offers: TOffers[];
};
export type TObject = Record<string, object | null | undefined | string | number>;
export type TObjectDate = Record<string, object | string | number | Date>;
export type TOffersByCities = Record<string, TOffers[]>;

export type City = {
  name: TCity;
  location: TLocation;
};

export type TLocation = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type TData= {
  city: TCity;
};

export type TAuthorizationPost = {
  avatarUrl: string;
  email: string;
  isPro: boolean;
  name: string;
  token: string;
};

export type TInitialState = TData & {
  offersByCities: TOffersByCities | null;
  email: string;
};

export type TReducer = { offers: TOffer[] };

export type TChildrenJsx = { children: JSX.Element };
export type TChildrenString = { children: string };

export type TCity = typeof СITIES[number] | '';
export type TCities = typeof СITIES;

export type TComment = {
  id: string;
  date: string;
  user: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
  comment: string;
  rating: number;
};

export type TPropSignal = { signal: AbortSignal };

export type TPayloadCity = { payload: TCity };
export type TPayloadString = { payload: string };