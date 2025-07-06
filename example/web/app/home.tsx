/**
 * Example of how to use @react-input-validator packages
 * https://github.com/atmulyana/react-input-validator
 */
import type { Route } from "./+types/home";
import {usePage} from "./Context";

import Basic from './pages/Basic';
import Auto from './pages/Auto';
import setMessageFunc from './pages/setMessageFunc';
import StatusIcon from './pages/StatusIcon';
import Compare from './pages/Compare';
import FileUpload from "./pages/FileUpload";

const pages: {[p: string]: React.ComponentType<any>} = {
    Basic,
    Auto,
    setMessageFunc,
    "Status Icon": StatusIcon,
    Compare,
    "File Upload": FileUpload,
};

export function meta({}: Route.MetaArgs) {
    return [
        { title: "@react-input-validator Demo" },
        { name: "description", content: "You may test @react-input-validator here!" },
    ];
}

export default function Home() {
    const page = usePage();
    const Page = pages[page] || (() => <h1>Home</h1>);
    return <Page />;
}
