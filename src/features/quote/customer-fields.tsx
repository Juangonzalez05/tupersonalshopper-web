"use client";

import Link from "next/link";
import { Checkbox, Field, Input, Textarea, describedBy } from "@/components/ui/field";

export interface CustomerValues {
  name: string;
  city: string;
  whatsapp: string;
  comments: string;
  consent: boolean;
}

export const emptyCustomer: CustomerValues = {
  name: "",
  city: "",
  whatsapp: "",
  comments: "",
  consent: false,
};

/** Campos de contacto compartidos por "Mi pedido" y "Encargos". */
export function CustomerFields({
  idPrefix,
  values,
  errors,
  onChange,
  commentsPlaceholder,
  showComments = true,
  twoColumns,
}: {
  idPrefix: string;
  values: CustomerValues;
  errors: Record<string, string>;
  onChange: (patch: Partial<CustomerValues>) => void;
  commentsPlaceholder?: string;
  showComments?: boolean;
  twoColumns?: boolean;
}) {
  const id = (name: string) => `${idPrefix}-${name}`;
  const nameField = (
    <Field id={id("name")} label="Nombre" error={errors.name}>
      <Input
        id={id("name")}
        name="name"
        autoComplete="name"
        placeholder="Ej. Laura Gómez"
        value={values.name}
        onChange={(e) => onChange({ name: e.target.value })}
        {...describedBy(id("name"), { error: errors.name })}
      />
    </Field>
  );
  const cityField = (
    <Field id={id("city")} label="Ciudad" error={errors.city}>
      <Input
        id={id("city")}
        name="city"
        autoComplete="address-level2"
        placeholder="Ej. Medellín"
        value={values.city}
        onChange={(e) => onChange({ city: e.target.value })}
        {...describedBy(id("city"), { error: errors.city })}
      />
    </Field>
  );
  return (
    <>
      {twoColumns ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {nameField}
          {cityField}
        </div>
      ) : (
        <>
          {nameField}
          {cityField}
        </>
      )}
      <Field
        id={id("whatsapp")}
        label="WhatsApp"
        hint="Con indicativo de país si no es de Colombia."
        error={errors.whatsapp}
      >
        <Input
          id={id("whatsapp")}
          name="whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+57 300 000 0000"
          value={values.whatsapp}
          onChange={(e) => onChange({ whatsapp: e.target.value })}
          {...describedBy(id("whatsapp"), { hint: true, error: errors.whatsapp })}
        />
      </Field>
      {showComments ? (
        <Field id={id("comments")} label="Comentarios" error={errors.comments}>
          <Textarea
            id={id("comments")}
            name="comments"
            placeholder={commentsPlaceholder}
            value={values.comments}
            onChange={(e) => onChange({ comments: e.target.value })}
            {...describedBy(id("comments"), { error: errors.comments })}
          />
        </Field>
      ) : null}
      <Checkbox
        id={id("consent")}
        checked={values.consent}
        onChange={(e) => onChange({ consent: e.target.checked })}
        error={errors.consent}
      >
        Acepto que Tu Shopper USA me contacte por WhatsApp para confirmar esta solicitud y el{" "}
        <Link
          href="/politica-de-datos"
          className="underline decoration-gold underline-offset-2"
          target="_blank"
        >
          tratamiento de mis datos
        </Link>
        .
      </Checkbox>
    </>
  );
}

/** Lleva el foco al primer campo con error (accesible con teclado y lector de pantalla). */
export function focusFirstError(idPrefix: string, errors: Record<string, string>, order: string[]) {
  const first = order.find((key) => errors[key]);
  if (first) document.getElementById(`${idPrefix}-${first.replace(/\./g, "-")}`)?.focus();
}
