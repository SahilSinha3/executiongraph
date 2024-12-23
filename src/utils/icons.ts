// CDN paths for workflow icons
export const workflowIcons = {
  google: 'https://e1cdn.social27.com/digitalevents/hivegpt-icons/workflow-Icons/Google.svg',
  arrow: 'https://e1cdn.social27.com/digitalevents/hivegpt-icons/workflow-Icons/arrow.svg',
  codeGenerator: 'https://e1cdn.social27.com/digitalevents/hivegpt-icons/workflow-Icons/code-generator.svg',
  editProcess: 'https://e1cdn.social27.com/digitalevents/hivegpt-icons/workflow-Icons/editprocess.svg',
  iterator: 'https://e1cdn.social27.com/digitalevents/hivegpt-icons/workflow-Icons/iterator.svg',
  memory: 'https://e1cdn.social27.com/digitalevents/hivegpt-icons/workflow-Icons/memory.svg',
  repeater: 'https://e1cdn.social27.com/digitalevents/hivegpt-icons/workflow-Icons/repeater.svg',
  router: 'https://e1cdn.social27.com/digitalevents/hivegpt-icons/workflow-Icons/router.svg',
  splitor: 'https://e1cdn.social27.com/digitalevents/hivegpt-icons/workflow-Icons/splitor.svg',
  workflowStart: 'https://e1cdn.social27.com/digitalevents/hivegpt-icons/workflow-Icons/workflow-01Starting.svg',
  workflowEnd: 'https://e1cdn.social27.com/digitalevents/hivegpt-icons/workflow-Icons/workflow-02Starting.svg'
};

export const getIconForNode = (nodeId: string): string | null => {
  switch (nodeId) {
    case 'start':
      return workflowIcons.workflowStart;
    case 'end':
      return workflowIcons.workflowEnd;
    case 'search-terms':
    case 'keyword-search':
    case 'smart-search':
      return workflowIcons.google;
    case 'web-scraper':
      return workflowIcons.iterator;
    case 'writer-helper':
      return workflowIcons.editProcess;
    case 'compliance-assistant':
      return workflowIcons.codeGenerator;
    case 'audit-guide':
      return workflowIcons.router;
    case 'content-finalizer':
      return workflowIcons.splitor;
    default:
      return null;
  }
};