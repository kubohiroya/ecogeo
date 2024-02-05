import { useEffect } from 'react';
import { getCurrentDatabaseTableType } from '../../services/database/GeoDatabaseTable';
import { DOCUMENT_TITLE } from '../../Constants';

export function useDocumentTitle() {
  useEffect(() => {
    const tableTypeName = getCurrentDatabaseTableType()
      ? 'Projects'
      : 'Resources';
    document.title = DOCUMENT_TITLE + ` - ` + tableTypeName;
  }, []);
}
