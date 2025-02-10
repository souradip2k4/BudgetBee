import { cn } from "@/lib/utils";
import {
	AnchorHTMLAttributes,
	BlockquoteHTMLAttributes,
	DetailedHTMLProps,
	HTMLAttributes,
} from "react";

export type Props = DetailedHTMLProps<
	HTMLAttributes<HTMLParagraphElement>,
	HTMLParagraphElement
>;

export type AnchorProps = DetailedHTMLProps<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	HTMLAnchorElement
>;

export type BlockQuoteProps = DetailedHTMLProps<
	BlockquoteHTMLAttributes<HTMLQuoteElement>,
	HTMLQuoteElement
>;

export function H1(props: Props) {
	const { className, children, ...rest } = props;
	return (
		<h1
			className={cn(
				"scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
				className,
			)}
			{...rest}>
			{children}
		</h1>
	);
}

export function H2(props: Props) {
	const { className, children, ...rest } = props;
	return (
		<h2
			className={cn(
				"mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
				className,
			)}
			{...rest}>
			{children}
		</h2>
	);
}

export function H3(props: Props) {
	const { className, children, ...rest } = props;
	return (
		<h3
			className={cn(
				"mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
				className,
			)}
			{...rest}>
			{children}
		</h3>
	);
}

export function P(props: Props) {
	const { className, children, ...rest } = props;
	return (
		<p className={cn("text-sm leading-7", className)} {...rest}>
			{children}
		</p>
	);
}

export function Anchor(props: AnchorProps) {
	const { className, children, ...rest } = props;
	return (
		<a
			className={cn(
				"font-medium text-blue-400 underline-offset-4 hover:underline",
				className,
			)}
			{...rest}>
			{children}
		</a>
	);
}

export function BlockQuote(props: BlockQuoteProps) {
	const { className, children, ...rest } = props;
	return (
		<blockquote
			className={cn("mt-6 border-l-2 pl-6 italic", className)}
			{...rest}>
			{children}
		</blockquote>
	);
}
