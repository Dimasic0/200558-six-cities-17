import {СITIES} from '../data/constant';

export type HousingRange = 'apartment' | 'room' | 'house' | 'hotel';

export type TOffer = {
  id: string;
  price: number;
  title: string;
  type: HousingRange;
  city: City;
  location: Location;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  previewImage: string;
  favorites?: boolean;
};
export type TOffersProp = {
  offers: TOffer[];
};
export type object = Record<string, object | null | string | number>;
export type TOffersByCities = Record<string, TOffer[]>;

export type City = {
  name: TCity;
  location: Location;
};

export type Location = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type TData= {
  city: TCity;
};

export type TInitialState = TData & {
  offersByCities: TOffersByCities | null;
  authorizationStatus: boolean;
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
