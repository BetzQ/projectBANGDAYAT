import React, { useState } from 'react';

interface Email {
  id: number;
  subject: string;
  username: string;
  sender: string;
  birth: string;
  date: string;
  content: string;
  email: string;
  phone: string;
  description: string
}

// Komponen daftar pesan email
const EmailList: React.FC<{
  emails: Email[];
  selectedEmails: number[];
  onSelectEmail: (id: number) => void;
  onToggleEmail: (emailId: number) => void;
}> = ({ emails, selectedEmails, onSelectEmail, onToggleEmail }) => {
  const handleToggleEmail = (emailId: number) => {
    onToggleEmail(emailId);
  };

  const MAX_CONTENT_WORDS = 3;

  const formatContent = (content: string) => {
    const words = content.split(' ');

    if (words.length > MAX_CONTENT_WORDS) {
      const shortenedContent = words.slice(0, MAX_CONTENT_WORDS).join(' ');
      return `${shortenedContent}...`;
    }

    return content;
  };

  return (
    <div className="mb-4">
      {emails.map((email) => (
        <div
          key={email.id}
          className={`border-b py-2 cursor-pointer ${
            selectedEmails.includes(email.id) ? 'bg-gray-200' : ''
          }`}
          onClick={() => onSelectEmail(email.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedEmails.includes(email.id)}
                onChange={() => handleToggleEmail(email.id)}
              />
              <span className="font-semibold">{email.subject}</span>
            </div>
            <span className="text-sm">{email.date}</span>
          </div>
          <div className="text-gray-600 text-sm">From: {email.sender}</div>
          <p className="text-gray-800 break-words">{formatContent(email.content)}</p>
        </div>
      ))}
    </div>
  );
};

// Komponen detail pesan email
const EmailDetail: React.FC<{ email: Email }> = ({ email }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    const handleMouseEnter = () => {
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
    };
  
    return (
      <div className="border-b mb-4 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold">{email.subject}</span>
            <div
              className="text-sm text-gray-500 hover:text-gray-900"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span>From: {email.sender}</span>
              {isHovered && (
                <div className="bg-gray-200/60 p-2 rounded-lg absolute z-10">
                  <p><strong>ID :</strong> {email.id}</p>
                  <p><strong>Username :</strong> {email.username}</p>
                  <p><strong>Tanggal Lahir :</strong> {email.birth}</p>
                  <p><strong>Deskripsi:</strong> {email.description}</p>
                </div>
              )}
            </div>
          </div>
          <span className="text-sm">{email.date}</span>
        </div>
        <div className="mt-2">
          <p className="text-gray-800 break-words">{email.content}</p>
        </div>
      </div>
    );
  };

// Fungsi Inbox
const Inbox: React.FC = () => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emailList, setEmailList] = useState<Email[]>([
    {
      id: 1,
      subject: 'Mike Johnson',
      username: 'mikejohnson',
      sender: 'mikejohnson@example.com',
      date: 'January 14, 2023',
      birth: '1999-7-20',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit 1.',
      email: 'mikejohnson@example.com',
      phone: '0987654321',
      description: 'Sebagai CEO di perusahaan Sheets, saya memiliki tanggung jawab untuk mengarahkan strategi dan visi perusahaan.'
    },
    {
      id: 0,
      subject: 'Admin',
      username: 'admin',
      sender: 'admin@example.com',
      date: 'April 1, 2023',
      birth: '12/16/2023',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit 2.',
      email: 'admin@example.com',
      phone: '0987654321',
      description: 'Sebagai admin di perusahaan Sheets, tanggung jawab saya meliputi mengelola dan menjaga operasional harian.'
    },
    // Tambahkan data dummy email lainnya di sini
  ]);
  const [selectedEmails, setSelectedEmails] = useState<number[]>([]);
  const [, setDeletedEmails] = useState<Email[]>([]);

  const handleSelectEmail = (emailId: number) => {
    const selected = emailList.find((email) => email.id === emailId);
    setSelectedEmail(selected || null);
  };

  const handleToggleEmail = (emailId: number) => {
    if (selectedEmails.includes(emailId)) {
      setSelectedEmails((prevSelectedEmails) =>
        prevSelectedEmails.filter((id) => id !== emailId)
      );
    } else {
      setSelectedEmails((prevSelectedEmails) => [...prevSelectedEmails, emailId]);
    }
  };

  const handleDeleteEmail = () => {
    if (selectedEmails.length > 0) {
      setEmailList((prevEmailList) =>
        prevEmailList.filter((email) => !selectedEmails.includes(email.id))
      );
      setDeletedEmails((prevDeletedEmails) =>
        prevDeletedEmails.concat(
          emailList.filter((email) => selectedEmails.includes(email.id))
        )
      );
      setSelectedEmails([]);
      setSelectedEmail(null);
    } else if (selectedEmail) {
      setEmailList((prevEmailList) =>
        prevEmailList.filter((email) => email.id !== selectedEmail.id)
      );
      setDeletedEmails((prevDeletedEmails) =>
        prevDeletedEmails.concat(selectedEmail)
      );
      setSelectedEmail(null);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        {selectedEmails.length > 0 && (
          <button
            className="bg-white p-3 py-2 rounded-lg mb-2 mr-5 absolute shadow-lg"
            onClick={handleDeleteEmail}
          >
            <i className="bi bi-trash text-lg"></i>
          </button>
        )}
      </div>
      <div className="bg-white w-full h-full rounded-lg shadow-md p-6">
        {/* Daftar pesan email */}
        <EmailList
          emails={emailList}
          selectedEmails={selectedEmails}
          onSelectEmail={handleSelectEmail}
          onToggleEmail={handleToggleEmail}
        />

        {/* Detail pesan email */}
        {selectedEmail && <EmailDetail email={selectedEmail} />}
      </div>
    </>
  );
};

export default Inbox;
