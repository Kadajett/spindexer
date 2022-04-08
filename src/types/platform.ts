import { ValidContractCallFunction } from "../clients/ethereum";
import { ArtistProfile } from "./artist";
import catalogMappers from './platforms/catalog';
import soundMappers from './platforms/sound';
import noizdMappers from './platforms/noizd';
import { Track, ProcessedTrack } from "./track";
import { Cursor } from '../types/trigger';

export enum MusicPlatform {
  sound = "sound",
  zora = "zora",
  noizd = "noizd",
  catalog = "catalog",
  zoraRaw = "zoraRaw",
  other = "other"
}

export type PlatformMapper = {
  addPlatformTrackData: (tracks: Track[], client: any) => Promise<{
    track: Track;
    platformTrackResponse: unknown;
  }[]>;
  mapTrack: (trackItem: {
    track: Track;
    platformTrackResponse: unknown;
  }) => ProcessedTrack;
  mapAPITrack?: (trackItem: unknown) => ProcessedTrack;
  mapArtistProfile: (artistItem: any, createdAtBlockNumber?: string) => ArtistProfile;
}

export type PlatformConfigItem = {
  contractCalls: ValidContractCallFunction[],
  contractMetadataField: ValidContractCallFunction,
  mappers?: PlatformMapper
  initialTrackCursor?: string
};

export type PlatformConfig = {
  [key in MusicPlatform]: PlatformConfigItem
}

export const platformConfig: PlatformConfig = {
  sound: {
    contractCalls: [ValidContractCallFunction.tokenURI],
    contractMetadataField: ValidContractCallFunction.tokenURI,
    mappers: soundMappers,
  },
  zora: {
    contractCalls: [ValidContractCallFunction.tokenURI, ValidContractCallFunction.tokenMetadataURI],
    contractMetadataField: ValidContractCallFunction.tokenMetadataURI,
  },
  catalog: {
    contractCalls: [ValidContractCallFunction.tokenURI, ValidContractCallFunction.tokenMetadataURI],
    contractMetadataField: ValidContractCallFunction.tokenMetadataURI,
    mappers: catalogMappers,
  },
  zoraRaw: {
    contractCalls: [ValidContractCallFunction.tokenURI, ValidContractCallFunction.tokenMetadataURI],
    contractMetadataField: ValidContractCallFunction.tokenMetadataURI,
  },
  noizd: {
    contractCalls: [ValidContractCallFunction.tokenURI],
    contractMetadataField: ValidContractCallFunction.tokenURI,
    mappers: noizdMappers,
  },
  other: {
    contractCalls: [ValidContractCallFunction.tokenURI],
    contractMetadataField: ValidContractCallFunction.tokenURI,
  }
}
