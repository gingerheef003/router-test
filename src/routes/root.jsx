import React, { useEffect } from "react"
import { Form, Link, NavLink, Outlet, redirect, useLoaderData, useNavigation, useSubmit } from "react-router-dom"
import "../styles/root.css"
import { createContact, getContacts } from "../contacts"

export async function loader({ request }) {
	const url = new URL(request.url);
	const q = url.searchParams.get("q");
	const contacts = await getContacts(q);
	return { contacts, q };
}

export async function action() {
	const contact = await createContact();
	return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {

	const { contacts, q } = useLoaderData();
	const navigation = useNavigation();
	const submit = useSubmit();

	const searching = navigation.location && new URLSearchParams(navigation.location.search).has(
		"q"
	)

	useEffect(() => {
		document.getElementById("q").value = q;
	}, [q]);

	return (
		<>
			<div id="sidebar">
				<h1>React Router Contacts</h1>
				<div>
					<Form id="search--form" role={"search"}>
						<input
							id="q"
							aria-label="Search contacts"
							className={searching ? "loading" : ""}
							placeholder="Search"
							type={"search"}
							name="q"
							defaultValue={q}
							onChange={e => {
								const isFirst = q == null;
								submit(e.currentTarget.form, {
									replace: !isFirst,
								})
							}}
						/>
						<div
							id="search-spinner"
							aria-hidden
							hidden={!searching}
						/>
						<div
							className="sr-only"
							aria-live="polite"
						></div>
					</Form>
					<Form method="post">
						<button type="submit">New</button>
					</Form>
				</div>
				<nav>
					{contacts.length ? (
						<ul>
						{contacts.map(contact => (
							<li key={contact.id}>
								<NavLink
									to={`contacts/${contact.id}`}
									className={({ isActive, isPending }) => 
										isActive ? "active" : isPending ? "pending" : ""
									}
								>	
									{contact.first || contact.last ? (
										<>
											{contact.first} {contact.last}
										</>
									) : (
										<i>No Name</i>
									)}{" "}
									{contact.favourite && <span>★</span>}
								</NavLink>
							</li>
						))}
						</ul>
					) : (
						<p>
							<i>No contact</i>
						</p>
					)}
				</nav>
			</div>
			<div
				id="detail"
				className={
					navigation.state === "loading" ? "loading" : ""
				}
				>
				<Outlet />
			</div>
		</>
	)
}
