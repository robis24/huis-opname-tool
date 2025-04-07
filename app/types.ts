export interface StepConfig {
  title: string;
  fields: FieldConfig[];
}

export const Fields = [
  "NumberField",
  "Text",
  "SelectField",
  "SmartPhotoField",
  "MultiField",
  "SmartAddressField",
  "TextArea",
] as const;

export type FieldType = (typeof Fields)[number];

export interface BaseFieldConfig {
  id: string;
  title: string;
  fieldType: FieldType;
  api?: string;
  rapport?: (typeof RapportFields)[number];
  autofill?: string;
}

export interface NumberFieldConfig extends BaseFieldConfig {
  fieldType: "NumberField";
  unit: string;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  fieldType: "SelectField";
  options: string[];
}

export interface MultiFieldConfig extends BaseFieldConfig {
  fieldType: "MultiField";
  fields: FieldConfigMultiField[];
}

export type FieldConfigMap = {
  NumberField: NumberFieldConfig;
  SelectField: SelectFieldConfig;
  Text: BaseFieldConfig;
  TextArea: BaseFieldConfig;
  SmartPhotoField: BaseFieldConfig;
  MultiField: MultiFieldConfig;
  SmartAddressField: BaseFieldConfig;
};

export type FieldConfig<T extends FieldType = FieldType> = FieldConfigMap[T];

export const FieldsMultiField = ["NumberField", "Text", "SelectField"] as const;

export type FieldTypeMultiField = (typeof FieldsMultiField)[number];

export type ConfigMapMultiField = {
  NumberField: NumberFieldConfig;
  SelectField: SelectFieldConfig;
  Text: BaseFieldConfig;
};

export type FieldConfigMultiField<
  T extends FieldTypeMultiField = FieldTypeMultiField
> = ConfigMapMultiField[T];

export const RapportFields = [
  "straat",
  "huisnummer",
  "stad",
  "bezoek datum",
  "energielabel",
  "verbruik electra",
  "verbruik gas",
  "woningtype",
  "bouwjaar",
  "oppervlakte",
  "vloer",
  "gevel",
  "ramen",
  "dak",
  "verwarming",
  "warmwater",
  "koken",
  "zonwering",
  "zonnepanelen",
  "airco",
  "ventilatie",
  "kans gevel",
  "kans dak",
  "kans ramen en deuren",
  "kans vloer",
] as const;

export const RapportTextFields = [
  "gevelisolatie",
  "vloerisolatie",
  "ramen en deuren",
  "dakisolatie",
  "advies",
  "uitleg verwarming",
  "uitleg ventilatie",
  "uitleg zonnepanelen",
  "uitleg subsidie",
] as const;

export type RapportField = (
  | typeof RapportFields
  | typeof RapportTextFields
)[number];

export type RapportTextField = (typeof RapportTextFields)[number];
