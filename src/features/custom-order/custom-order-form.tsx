"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { site } from "@/config/site";
import { MAX_CUSTOM_ITEMS, customOrderSchema, fieldErrors } from "@/domain/schemas";
import { customOrderMessage, whatsappUrl } from "@/domain/whatsapp";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, Input, describedBy } from "@/components/ui/field";
import { CheckIcon, PlusIcon, WhatsAppIcon } from "@/components/icons/icons";
import {
  CustomerFields,
  emptyCustomer,
  focusFirstError,
  type CustomerValues,
} from "@/features/quote/customer-fields";

interface ItemValues {
  name: string;
  link: string;
  features: string;
}

const emptyItem: ItemValues = { name: "", link: "", features: "" };
const PREFIX = "enc";

export function CustomOrderForm() {
  const [items, setItems] = useState<ItemValues[]>([emptyItem]);
  const [customer, setCustomer] = useState<CustomerValues>(emptyCustomer);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const clearErrors = (keys: string[]) =>
    setErrors((current) => {
      const next = { ...current };
      for (const key of keys) delete next[key];
      return next;
    });

  const updateItem = (index: number, patch: Partial<ItemValues>) => {
    setItems((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
    clearErrors(Object.keys(patch).map((key) => `items.${index}.${key}`));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = customOrderSchema.safeParse({ ...customer, items });
    if (!result.success) {
      const found = fieldErrors(result.error);
      setErrors(found);
      const order = [
        ...items.flatMap((_, i) => [`items.${i}.name`, `items.${i}.link`, `items.${i}.features`]),
        "name",
        "city",
        "whatsapp",
        "comments",
        "consent",
      ];
      focusFirstError(PREFIX, found, order);
      return;
    }
    const { items: validItems, consent, ...data } = result.data;
    const url = whatsappUrl(site.whatsappNumber, customOrderMessage(validItems, data));
    window.open(url, "_blank", "noopener,noreferrer");
    setSentUrl(url);
  };

  if (sentUrl) {
    return (
      <div className="flex flex-col items-start gap-4 py-6" aria-live="polite">
        <span className="flex size-16 items-center justify-center rounded-full border border-gold text-gold-ink">
          <CheckIcon className="size-7" strokeWidth={1.3} />
        </span>
        <h2 className="type-h2">Tu encargo está listo en WhatsApp</h2>
        <p className="type-lead text-muted">
          Envía el mensaje y buscamos el producto en la tienda: te escribimos con precio final,
          disponibilidad y tiempos.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={sentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "gold" })}
          >
            <WhatsAppIcon />
            Abrir WhatsApp
          </a>
          <Link href="/catalogo" className={buttonVariants({ variant: "navy" })}>
            Ver catálogo
          </Link>
          <Button
            variant="line"
            onClick={() => {
              setItems([emptyItem]);
              setCustomer((c) => ({ ...c, comments: "" }));
              setSentUrl(null);
            }}
          >
            Hacer otro encargo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
      <h2 id="enc-t" className="type-h3">
        ¿Qué quieres que compremos?
      </h2>
      {items.map((item, index) => {
        const id = (name: string) => `${PREFIX}-items-${index}-${name}`;
        const error = (name: string) => errors[`items.${index}.${name}`];
        return (
          <fieldset
            key={index}
            className="m-0 flex flex-col gap-[18px] border-0 border-t border-gold p-0 pt-5"
          >
            <legend className="float-left type-eyebrow mb-1 w-full p-0 text-gold-ink">
              <span className="flex items-center justify-between gap-3">
                Producto {index + 1}
                {items.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => setItems((current) => current.filter((_, i) => i !== index))}
                    className="min-h-11 border-0 bg-transparent p-0 text-xs font-semibold tracking-[.12em] text-navy uppercase underline decoration-gold underline-offset-[6px]"
                    aria-label={`Quitar producto ${index + 1}`}
                  >
                    Quitar
                  </button>
                ) : null}
              </span>
            </legend>
            <Field id={id("name")} label="Nombre del producto" error={error("name")}>
              <Input
                id={id("name")}
                value={item.name}
                onChange={(e) => updateItem(index, { name: e.target.value })}
                placeholder="Ej. Audífonos inalámbricos, freidora de aire, tenis…"
                {...describedBy(id("name"), { error: error("name") })}
              />
            </Field>
            <Field
              id={id("link")}
              label="Enlace del producto"
              hint="Si no tienes enlace, describe el producto lo mejor posible."
              error={error("link")}
            >
              <Input
                id={id("link")}
                type="url"
                inputMode="url"
                value={item.link}
                onChange={(e) => updateItem(index, { link: e.target.value })}
                placeholder="https://www.walmart.com/…"
                {...describedBy(id("link"), { hint: true, error: error("link") })}
              />
            </Field>
            <Field id={id("features")} label="Características" error={error("features")}>
              <Input
                id={id("features")}
                value={item.features}
                onChange={(e) => updateItem(index, { features: e.target.value })}
                placeholder="Talla, color, aroma, presentación, cantidad"
                {...describedBy(id("features"), { error: error("features") })}
              />
            </Field>
          </fieldset>
        );
      })}
      {items.length < MAX_CUSTOM_ITEMS ? (
        <Button
          variant="line"
          size="sm"
          className="self-start"
          onClick={() => setItems((current) => [...current, emptyItem])}
        >
          <PlusIcon />
          Agregar otro producto
        </Button>
      ) : (
        <p className="m-0 type-small text-muted">
          Máximo {MAX_CUSTOM_ITEMS} productos por encargo. Si necesitas más, escríbenos por
          WhatsApp.
        </p>
      )}

      <div className="flex flex-col gap-[18px] border-t border-line pt-5">
        <h3 className="type-h3 md:text-[22px]">Tus datos</h3>
        <CustomerFields
          idPrefix={PREFIX}
          values={customer}
          errors={errors}
          onChange={(patch) => {
            setCustomer((current) => ({ ...current, ...patch }));
            clearErrors(Object.keys(patch));
          }}
          commentsPlaceholder="¿Para cuándo lo necesitas? ¿Aceptas alternativas similares?"
          twoColumns
        />
      </div>
      <Button type="submit" variant="gold" size="lg" block>
        <WhatsAppIcon />
        Enviar encargo
      </Button>
      <p className="m-0 text-center type-small text-muted">
        Sin costo por cotizar. Solo compramos cuando confirmas.
      </p>
    </form>
  );
}
