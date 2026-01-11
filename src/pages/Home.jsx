import React, { useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { Github } from 'lucide-react';

const Home = () => {
    const [originalUrl, setOriginalUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleUrlChange = (e) => {
        let val = e.target.value;
        setOriginalUrl(val);
    };

    const handleBlur = () => {
        if (originalUrl && !originalUrl.match(/^https?:\/\//i)) {
            setOriginalUrl('https://' + originalUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            const response = await fetch('/api/v1/shorturls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ longUrl: originalUrl })
            });

            if (response.ok) {
                const data = await response.json();
                setResult(data);
            } else {
                setError('Failed to shorten URL. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!result?.shortUrl) return;

        const fullUrl = result.shortUrl.startsWith('http')
            ? result.shortUrl
            : `${window.location.origin}/${result.shortUrl}`;

        navigator.clipboard.writeText(fullUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <Layout>
            <div className="main-wrapper" style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                marginTop: '10rem',
                justifyContent: 'center',
                padding: '20px'
            }}>
                <div className="container" style={{ width: '100%', maxWidth: '620px' }}>
                    <h1 style={{
                        fontSize: 'clamp(3.5rem, 8vw, 6rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.05em',
                        marginBottom: '0.25rem',
                        lineHeight: 0.9,
                        transition: 'color 0.3s ease'
                    }}>
                        lua.pw
                    </h1>
                    <p className="subtitle" style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-color)',
                        opacity: 0.6,
                        fontWeight: 400,
                        marginLeft: '0.25rem',
                        letterSpacing: '0.3em',
                        marginTop: '-0.25rem',
                        marginBottom: '3rem',
                        textTransform: 'uppercase',
                        transition: 'color 0.3s ease'
                    }}>
                        Fast, elegant


                    </p>


                    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                        <div className="input-wrapper" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            borderRadius: '9999px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--input-bg) ',
                            padding: '0.4rem',
                            paddingLeft: '1.5rem',
                            transition: 'transform 0.15s ease, border-color 0.3s ease, box-shadow 0.15s ease',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                        }}>
                            <input
                                type="url"
                                value={originalUrl}
                                onChange={handleUrlChange}
                                onBlur={handleBlur}
                                placeholder="Enter your URL"
                                required
                                autoComplete="off"
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-color)',
                                    padding: '0.8rem 0',
                                    fontSize: '1rem',
                                    fontWeight: 400,
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    transition: 'color 0.3s ease'
                                }}
                            />
                            <Button type="submit" className="action-btn" isLoading={isLoading} style={{
                                borderRadius: '9999px',
                                padding: '0.8rem 2rem',
                                fontSize: '0.9rem'
                            }}>
                                Shorten
                            </Button>
                        </div>
                    </form>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <button
                            onClick={() => window.location.href = 'http://localhost:5000/oauth2/authorization/google'}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                background: 'white',
                                color: 'black',
                                border: '1px solid var(--border-color)', /* Reduced from 2px */
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: '0.9rem'
                            }}
                            title="Login with Google"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.24-1.19-2.6z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                        <button
                            onClick={() => window.location.href = 'http://localhost:5000/oauth2/authorization/github'}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                background: 'white',
                                color: 'black',
                                border: '1px solid var(--border-color)', /* Reduced from 2px */
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: '0.9rem'
                            }}
                            title="Login with GitHub"
                        >
                            <Github size={20} />
                            GitHub
                        </button>
                    </div>

                    {result && (
                        <div id="result" className="show" style={{
                            opacity: 1,
                            transform: 'translateY(0)',
                            transition: 'all 0.2s ease'
                        }}>
                            <div className="result-content" style={{
                                background: 'var(--input-bg)',
                                border: '2px solid var(--border-color)',
                                padding: '1.5rem',
                                position: 'relative',
                                transition: 'background-color 0.3s ease, border-color 0.3s ease'
                            }}>
                                <div style={{
                                    fontSize: '0.7rem',
                                    color: 'var(--text-color)',
                                    opacity: 0.6,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.2em',
                                    marginBottom: '1rem',
                                    fontWeight: 600
                                }}>Shortened URL</div>

                                <div className="result-url" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}>
                                    <a href={result.shortUrl} target="_blank" rel="noopener noreferrer" style={{
                                        color: 'var(--text-color)',
                                        textDecoration: 'none',
                                        fontSize: '1.1rem',
                                        fontWeight: 500,
                                        flex: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        borderBottom: '2px solid var(--border-color)',
                                        paddingBottom: '2px'
                                    }}>
                                        {result.shortUrl}
                                    </a>
                                    <button onClick={copyToClipboard} className={copied ? "copy-btn copied" : "copy-btn"} style={{
                                        background: copied ? 'var(--text-color)' : 'var(--input-bg)',
                                        color: copied ? 'var(--contrast-text)' : 'var(--text-color)',
                                        border: '2px solid var(--border-color)',
                                        padding: '0.6rem 1.25rem',
                                        fontSize: '0.7rem',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        fontWeight: 600,
                                        fontFamily: 'inherit'
                                    }}>
                                        {copied ? '✓ Copied' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: '#ffe5e5',
                            border: '2px solid #ff0000',
                            color: '#ff0000',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                        }}>
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </Layout >
    );
};

export default Home;

