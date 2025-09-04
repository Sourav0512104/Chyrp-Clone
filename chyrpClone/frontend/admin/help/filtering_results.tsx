import React from "react";

export default function FilteringResultsHelp() {
  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Filtering Results</h1>

      <p className="mb-4">
        Use this search field to filter for specific items by entering plain text or keywords.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Keywords</h2>
      <p className="mb-4">
        Use the syntax <code>keyword:value;</code> to quickly match specific results
        where <code>keyword</code> is equal to <code>value</code>. The keyword can be
        the name of a database column, the name of an author or a group, or a
        date/time. For example:{" "}
        <code>author:Foo;year:2016;</code> would filter the posts table to display only
        posts created by Foo in 2016.
      </p>

      <p className="mb-4">
        Use the syntax <code>ASC:column;</code> or <code>DESC:column;</code> to sort
        the results in ascending or descending order. For example:{" "}
        <code>DESC:user_id;ASC:id;</code> would sort a table of posts in descending
        order of user ID and then ascending order of post ID.
      </p>

      <p className="mb-4">
        Use the SQL wildcards <code>_</code> and <code>%</code> to substitute one or
        multiple characters in a search term. To include these characters literally,
        prefix <code>|</code> as an escape character.
      </p>
    </div>
  );
}
