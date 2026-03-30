import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { ChevronRight, Briefcase } from 'lucide-react';

export default function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects/');
                setProjects(res.data);
            } catch (error) {
                console.error("Failed to fetch projects");
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) return <div>Loading jobs...</div>;

    if (projects.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
                {projects.map((project) => (
                    <li key={project.id}>
                        <Link to={`/projects/${project.id}`} className="block hover:bg-gray-50">
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-brand-600 truncate">
                                        {project.title}
                                    </p>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {project.status}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            {project.description.substring(0, 50)}...
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                        <p>Created {new Date(project.created_at).toLocaleDateString()}</p>
                                        <ChevronRight className="ml-2 flex-shrink-0 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}